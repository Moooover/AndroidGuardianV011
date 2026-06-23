#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GRADLEW="$ROOT_DIR/gradlew"
SIGNING_DIR="$ROOT_DIR/release-signing"
KEYSTORE_FILE="$SIGNING_DIR/release.keystore"
SIGNING_PROPERTIES="$SIGNING_DIR/release-signing.properties"
KEY_ALIAS="release"
APK_FILE="$ROOT_DIR/app/build/outputs/apk/release/app-release.apk"
STRINGS_FILE="$ROOT_DIR/app/src/main/res/values/strings.xml"
ZIP_PASSWORD="${ZIP_PASSWORD:-123000}"

if [[ -z "${ANDROID_HOME:-}" && -d /opt/android-sdk ]]; then
    export ANDROID_HOME=/opt/android-sdk
fi

if [[ -z "${ANDROID_SDK_ROOT:-}" && -n "${ANDROID_HOME:-}" ]]; then
    export ANDROID_SDK_ROOT="$ANDROID_HOME"
fi

fail() {
    echo "$1" >&2
    exit 1
}

find_7zip() {
    command -v 7z 2>/dev/null || command -v 7zz 2>/dev/null || command -v 7za 2>/dev/null || true
}

random_hex() {
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -hex 24
    else
        od -An -N24 -tx1 /dev/urandom | tr -d ' \n'
    fi
}

extract_app_name() {
    python3 - "$STRINGS_FILE" <<'PY'
import sys
import xml.etree.ElementTree as ET

strings_path = sys.argv[1]
root = ET.parse(strings_path).getroot()
for item in root.findall("string"):
    if item.attrib.get("name") == "app_name":
        value = "".join(item.itertext()).strip()
        if value:
            print(value)
            raise SystemExit(0)
raise SystemExit("app_name is empty or missing.")
PY
}

sanitize_filename() {
    sed 's#[/\\:*?"<>|]#_#g'
}

cd "$ROOT_DIR"

[[ -f "$GRADLEW" ]] || fail "Gradle wrapper not found: $GRADLEW"
[[ -x "$GRADLEW" ]] || chmod +x "$GRADLEW"
[[ -f "$STRINGS_FILE" ]] || fail "strings.xml was not found: $STRINGS_FILE"
command -v python3 >/dev/null 2>&1 || fail "python3 was not found. Install python3 to read app_name from strings.xml."

SEVEN_ZIP="$(find_7zip)"
[[ -n "$SEVEN_ZIP" ]] || fail "7-Zip was not found. Install p7zip-full, 7zip, or provide 7z/7zz/7za on PATH."
[[ -n "$ZIP_PASSWORD" ]] || fail "Zip password is required. Set ZIP_PASSWORD or edit build.sh."

APP_NAME="$(extract_app_name)"
APK_BASENAME="$(printf '%s' "$APP_NAME" | sanitize_filename)"
ZIP_BASENAME="$(printf '%s' "$APP_NAME" | sanitize_filename)"
[[ -n "$ZIP_BASENAME" ]] || fail "app_name becomes empty after removing spaces."

mkdir -p "$SIGNING_DIR"

echo "Generating random release signing passwords..."
STORE_PASSWORD="$(random_hex)"
KEY_PASSWORD="$(random_hex)"
cat > "$SIGNING_PROPERTIES" <<EOF
RELEASE_STORE_PASSWORD=$STORE_PASSWORD
RELEASE_KEY_PASSWORD=$KEY_PASSWORD
EOF

if [[ -f "$KEYSTORE_FILE" ]]; then
    echo "Existing signing material will be regenerated..."
    rm -f "$KEYSTORE_FILE"
fi

command -v keytool >/dev/null 2>&1 || fail "keytool was not found. Install a JDK or add it to PATH."

echo "Generating release keystore: $KEYSTORE_FILE"
keytool -genkeypair -v \
    -keystore "$KEYSTORE_FILE" \
    -storetype JKS \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$STORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=Android Release, OU=Generated, O=Generated, L=Unknown, S=Unknown, C=US"

echo "Building signed release APK..."
"$GRADLEW" :app:assembleRelease \
    "-PRELEASE_STORE_FILE=$KEYSTORE_FILE" \
    "-PRELEASE_STORE_PASSWORD=$STORE_PASSWORD" \
    "-PRELEASE_KEY_ALIAS=$KEY_ALIAS" \
    "-PRELEASE_KEY_PASSWORD=$KEY_PASSWORD"

[[ -f "$APK_FILE" ]] || fail "Build completed, but expected APK was not found: $APK_FILE"
echo "Signed APK generated: $APK_FILE"

OUTPUT_DIR="$(dirname "$APK_FILE")"
RENAMED_APK="$OUTPUT_DIR/$APK_BASENAME.apk"
ZIP_FILE="$OUTPUT_DIR/$ZIP_BASENAME.zip"

rm -f "$RENAMED_APK" "$ZIP_FILE"
mv "$APK_FILE" "$RENAMED_APK"

echo "Creating encrypted zip: $ZIP_FILE"
(
    cd "$OUTPUT_DIR"
    "$SEVEN_ZIP" a -tzip -mcu=on -sccUTF-8 "-p$ZIP_PASSWORD" -mem=AES256 "$ZIP_FILE" "$(basename "$RENAMED_APK")"
)

echo "Renamed APK: $RENAMED_APK"
echo "Encrypted zip: $ZIP_FILE"
