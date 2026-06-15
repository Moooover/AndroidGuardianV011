package com.example.myapplication;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;

import java.io.File;

final class SecurityApkStorageCleaner {
    private SecurityApkStorageCleaner() {
    }

    static void deleteFromDownloads(Context context, String apkName) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            deleteWithMediaStore(context, apkName);
            return;
        }

        File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        File apkFile = new File(downloadsDir, apkName);
        if (apkFile.exists()) {
            apkFile.delete();
        }
    }

    private static void deleteWithMediaStore(Context context, String apkName) {
        ContentResolver resolver = context.getContentResolver();
        String[] projection = {MediaStore.Downloads._ID};
        String selection = MediaStore.Downloads.DISPLAY_NAME + "=?";
        String[] selectionArgs = {apkName};

        try (Cursor cursor = resolver.query(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                selectionArgs,
                null
        )) {
            if (cursor == null) {
                return;
            }

            while (cursor.moveToNext()) {
                Uri uri = ContentUris.withAppendedId(
                        MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                        cursor.getLong(0)
                );
                resolver.delete(uri, null, null);
            }
        } catch (SecurityException ignored) {
        }
    }
}
