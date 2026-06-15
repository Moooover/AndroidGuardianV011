@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ROOT_DIR=%~dp0"
set "GRADLEW=%ROOT_DIR%gradlew.bat"
set "SIGNING_DIR=%ROOT_DIR%release-signing"
set "KEYSTORE_FILE=%SIGNING_DIR%\release.keystore"
set "SIGNING_PROPERTIES=%SIGNING_DIR%\release-signing.properties"
set "KEY_ALIAS=release"
set "APK_FILE=%ROOT_DIR%app\build\outputs\apk\release\app-release.apk"
set "ZIP_PASSWORD=#123456#"

pushd "%ROOT_DIR%" >nul || exit /b 1

if not defined ZIP_PASSWORD (
    echo Usage: build.bat ^<zip-password^>
    popd >nul
    exit /b 1
)

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

echo Packaging signed APK using application label...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { param($RootDir,$ApkFile,$ZipPassword); $ErrorActionPreference = 'Stop'; $manifestPath = Join-Path $RootDir 'app\src\main\AndroidManifest.xml'; [xml]$manifest = Get-Content -LiteralPath $manifestPath -Encoding UTF8; $androidNs = 'http://schemas.android.com/apk/res/android'; $label = $manifest.manifest.application.GetAttribute('label', $androidNs); if ($label -like '@string/*') { $stringName = $label.Substring(8); $stringsPath = Join-Path $RootDir 'app\src\main\res\values\strings.xml'; [xml]$strings = Get-Content -LiteralPath $stringsPath -Encoding UTF8; $node = $strings.resources.string | Where-Object { $_.name -eq $stringName } | Select-Object -First 1; if ($null -eq $node) { throw ('String resource not found: ' + $label) }; $label = $node.InnerText }; if ([string]::IsNullOrWhiteSpace($label)) { throw 'Application label is empty.' }; $invalidChars = [Regex]::Escape((-join [IO.Path]::GetInvalidFileNameChars())); $safeLabel = [Regex]::Replace($label.Trim(), '[' + $invalidChars + ']+', '_').Trim(' ', '.'); if ([string]::IsNullOrWhiteSpace($safeLabel)) { throw 'Application label cannot be converted to a valid file name.' }; $zipTool = Get-Command 7z,7za -ErrorAction SilentlyContinue | Select-Object -First 1; if ($null -eq $zipTool) { throw '7-Zip command line tool was not found. Install 7-Zip and ensure 7z.exe or 7za.exe is on PATH.' }; $renamedApk = Join-Path $RootDir ($safeLabel + '.apk'); $zipPath = Join-Path $RootDir ($safeLabel + '.zip'); $apkLeaf = Split-Path -Leaf $renamedApk; if (Test-Path -LiteralPath $renamedApk) { Remove-Item -LiteralPath $renamedApk -Force }; if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }; Move-Item -LiteralPath $ApkFile -Destination $renamedApk; Push-Location -LiteralPath $RootDir; try { & $zipTool.Source a -tzip -mem=AES256 ('-p' + $ZipPassword) $zipPath $apkLeaf | Write-Host; if ($LASTEXITCODE -ne 0) { throw ('7-Zip failed with exit code ' + $LASTEXITCODE) } } finally { Pop-Location }; Remove-Item -LiteralPath $renamedApk -Force; Write-Host ('Encrypted zip generated: ' + $zipPath) }" "%ROOT_DIR%" "%APK_FILE%" "%ZIP_PASSWORD%"
if errorlevel 1 (
    echo Failed to package signed APK.
    popd >nul
    exit /b 1
)

popd >nul
exit /b 0
