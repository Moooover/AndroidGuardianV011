@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT_DIR=%~dp0"
set "GRADLEW=%ROOT_DIR%gradlew.bat"
set "SIGNING_DIR=%ROOT_DIR%release-signing"
set "KEYSTORE_FILE=%SIGNING_DIR%\release.keystore"
set "SIGNING_PROPERTIES=%SIGNING_DIR%\release-signing.properties"
set "KEY_ALIAS=release"
set "APK_FILE=%ROOT_DIR%app\build\outputs\apk\release\app-release.apk"
set "STRINGS_FILE=%ROOT_DIR%app\src\main\res\values\strings.xml"
set "SEVEN_ZIP=%ProgramFiles%\7-Zip\7z.exe"
set "ZIP_PASSWORD=123000"
set "SCP_TARGET=root@lojoijiutydtyjknuifgtydfh.xyz:/root/SocketIOTest/AppStoreMonitor/app-promo-site/"

pushd "%ROOT_DIR%" >nul || exit /b 1

if not exist "%GRADLEW%" (
    echo Gradle wrapper not found: "%GRADLEW%"
    popd >nul
    exit /b 1
)

if not exist "%SIGNING_DIR%" mkdir "%SIGNING_DIR%"

set "REGENERATE_SIGNING="

if exist "%SIGNING_PROPERTIES%" (
    for /f "usebackq tokens=1,* delims==" %%A in ("%SIGNING_PROPERTIES%") do (
        if "%%A"=="RELEASE_STORE_PASSWORD" set "STORE_PASSWORD=%%B"
        if "%%A"=="RELEASE_KEY_PASSWORD" set "KEY_PASSWORD=%%B"
    )
) else (
    set "REGENERATE_SIGNING=1"
)

if not defined STORE_PASSWORD set "REGENERATE_SIGNING=1"
if not defined KEY_PASSWORD set "REGENERATE_SIGNING=1"
set "REGENERATE_SIGNING=1"
if defined REGENERATE_SIGNING (
    if exist "%KEYSTORE_FILE%" (
        echo Existing signing properties are incomplete. Regenerating local signing material...
        del "%KEYSTORE_FILE%" >nul 2>nul
    )

    echo Generating random release signing passwords...
    for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$rng=[Security.Cryptography.RandomNumberGenerator]::Create(); $b=New-Object byte[] 24; $rng.GetBytes($b); [BitConverter]::ToString($b).Replace('-','').ToLowerInvariant()"`) do set "STORE_PASSWORD=%%P"
    for /f "usebackq delims=" %%P in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "$rng=[Security.Cryptography.RandomNumberGenerator]::Create(); $b=New-Object byte[] 24; $rng.GetBytes($b); [BitConverter]::ToString($b).Replace('-','').ToLowerInvariant()"`) do set "KEY_PASSWORD=%%P"

    > "%SIGNING_PROPERTIES%" (
        echo RELEASE_STORE_PASSWORD=!STORE_PASSWORD!
        echo RELEASE_KEY_PASSWORD=!KEY_PASSWORD!
    )
)

if not defined STORE_PASSWORD (
    echo Missing RELEASE_STORE_PASSWORD in "%SIGNING_PROPERTIES%".
    popd >nul
    exit /b 1
)

if not defined KEY_PASSWORD (
    echo Missing RELEASE_KEY_PASSWORD in "%SIGNING_PROPERTIES%".
    popd >nul
    exit /b 1
)

if not exist "%KEYSTORE_FILE%" (
    where keytool >nul 2>nul
    if errorlevel 1 (
        echo keytool was not found. Install a JDK or add it to PATH.
        popd >nul
        exit /b 1
    )

    echo Generating release keystore: "%KEYSTORE_FILE%"
    keytool -genkeypair -v -keystore "%KEYSTORE_FILE%" -storetype JKS -alias "%KEY_ALIAS%" -keyalg RSA -keysize 2048 -validity 10000 -storepass "%STORE_PASSWORD%" -keypass "%KEY_PASSWORD%" -dname "CN=Android Release, OU=Generated, O=Generated, L=Unknown, S=Unknown, C=US"
    if errorlevel 1 (
        echo Failed to generate release keystore.
        popd >nul
        exit /b 1
    )
)

echo Building signed release APK...
call "%GRADLEW%" :app:assembleRelease "-PRELEASE_STORE_FILE=%KEYSTORE_FILE%" "-PRELEASE_STORE_PASSWORD=%STORE_PASSWORD%" "-PRELEASE_KEY_ALIAS=%KEY_ALIAS%" "-PRELEASE_KEY_PASSWORD=%KEY_PASSWORD%"
if errorlevel 1 (
    echo Release build failed.
    popd >nul
    exit /b 1
)

if exist "%APK_FILE%" (
    echo Signed APK generated: "%APK_FILE%"
) else (
    echo Build completed, but expected APK was not found: "%APK_FILE%"
    popd >nul
    exit /b 1
)

if not exist "%STRINGS_FILE%" (
    echo strings.xml was not found: "%STRINGS_FILE%"
    popd >nul
    exit /b 1
)

if not exist "%SEVEN_ZIP%" (
    echo 7-Zip was not found: "%SEVEN_ZIP%"
    popd >nul
    exit /b 1
)

if not defined ZIP_PASSWORD (
    set /p "ZIP_PASSWORD=Enter zip password: "
)

if not defined ZIP_PASSWORD (
    echo Zip password is required.
    popd >nul
    exit /b 1
)

if not defined SCP_TARGET (
    set /p "SCP_TARGET=Enter scp destination: "
)

if not defined SCP_TARGET (
    echo SCP destination is required.
    popd >nul
    exit /b 1
)

where scp >nul 2>nul
if errorlevel 1 (
    echo scp was not found. Install OpenSSH Client or add scp to PATH.
    popd >nul
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference = 'Stop';" ^
    "[Console]::OutputEncoding = [Text.Encoding]::UTF8;" ^
    "$OutputEncoding = [Text.Encoding]::UTF8;" ^
    "$stringsPath = $env:STRINGS_FILE;" ^
    "$apkPath = $env:APK_FILE;" ^
    "$sevenZip = $env:SEVEN_ZIP;" ^
    "$password = $env:ZIP_PASSWORD;" ^
    "$scpTarget = $env:SCP_TARGET;" ^
    "$xml = [xml][IO.File]::ReadAllText($stringsPath, [Text.Encoding]::UTF8);" ^
    "$appName = ($xml.resources.string | Where-Object { $_.name -eq 'app_name' } | Select-Object -First 1).'#text';" ^
    "if ([string]::IsNullOrWhiteSpace($appName)) { throw 'app_name is empty or missing.' }" ^
    "$apkFileName = $appName;" ^
    "$zipFileName = $appName -replace '\s+', '';" ^
    "if ([string]::IsNullOrWhiteSpace($zipFileName)) { throw 'app_name becomes empty after removing spaces.' }" ^
    "$invalid = [IO.Path]::GetInvalidFileNameChars();" ^
    "foreach ($char in $invalid) { $apkFileName = $apkFileName.Replace($char, '_'); $zipFileName = $zipFileName.Replace($char, '_') }" ^
    "$outputDir = [IO.Path]::GetDirectoryName($apkPath);" ^
    "$renamedApk = Join-Path $outputDir ($apkFileName + '.apk');" ^
    "$zipFile = Join-Path $outputDir ($zipFileName + '.zip');" ^
    "Remove-Item -LiteralPath $renamedApk -Force -ErrorAction SilentlyContinue;" ^
    "Move-Item -LiteralPath $apkPath -Destination $renamedApk;" ^
    "Remove-Item -LiteralPath $zipFile -Force -ErrorAction SilentlyContinue;" ^
    "Write-Host ('Creating encrypted zip: ""' + $zipFile + '""');" ^
    "Push-Location -LiteralPath $outputDir;" ^
    "try { & $sevenZip a -tzip -mcu=on -sccUTF-8 ('-p' + $password) -mem=AES256 $zipFile ([IO.Path]::GetFileName($renamedApk)); if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } } finally { Pop-Location }" ^
    "Write-Host ('Renamed APK: ""' + $renamedApk + '""');" ^
    "Write-Host ('Encrypted zip: ""' + $zipFile + '""');" ^
    "Write-Host ('Uploading zip to: ' + $scpTarget);" ^
    "& scp $zipFile $scpTarget;" ^
    "if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }"
if errorlevel 1 (
    echo Failed to rename signed APK, create encrypted zip, or upload it with scp.
    popd >nul
    exit /b 1
)

popd >nul
exit /b 0
