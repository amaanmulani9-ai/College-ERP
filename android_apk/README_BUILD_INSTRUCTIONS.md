# 📱 CampusPro College ERP - Android Native APK Project

This folder `android_apk/` contains the complete **Android Native Mobile Application Project** for CampusPro College ERP.

It provides a native mobile Android shell for Students, Staff, Parents, and Administrators with full feature support:
- 🔐 **Persistent Auto-Login** (Cookie Session Persistence)
- 📸 **Camera & File Upload** (Document upload, QR Attendance, Receipts)
- 📄 **PDF & Report Downloads** (Marksheet, NAAC Report, Fee Receipt direct download to Android Phone)
- 🔔 **Mobile Push Notifications** (Firebase Cloud Messaging / PWA push)
- ⚡ **Offline Support** (Service Worker caching)

---

## 🛠️ How to Build the APK File

### Method 1: Android Studio (Recommended)
1. Open **Android Studio**.
2. Click **Open an existing project** and select this directory (`android_apk/`).
3. Allow Gradle to sync.
4. Go to **Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)**.
5. Once complete, click **Locate** to find your compiled `app-debug.apk` file!
6. Copy `app-debug.apk` to your phone or distribute it to students/staff.

### Method 2: Command Line (Gradle)
```bash
cd android_apk
gradlew assembleDebug
```
The generated APK file will be located at:
`android_apk/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 Instant PWA Android Installation (No Computer Needed)
Students & staff browsing on their Android phones can also install the ERP app instantly:
1. Open Chrome on Android phone and visit the College ERP site.
2. Tap the **3-dots menu ➔ Add to Home Screen / Install App**.
3. The app icon **CampusPro ERP** will appear on the Android home screen like a native APK!
