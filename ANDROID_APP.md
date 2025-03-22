# Creating an Android App for TimeCapsule

This guide provides instructions for converting the TimeCapsule web application into an Android app.

## Option 1: Capacitor Method (Recommended)

[Capacitor](https://capacitorjs.com/) allows you to create native iOS and Android apps using your existing web code.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK tools and platform tools installed
- Java Development Kit (JDK) installed

### Setup Instructions

1. **Install Capacitor dependencies**

   ```bash
   npm run android:setup
   # This runs: npm i @capacitor/core @capacitor/android && npx cap init TimeCapsule "TimeCapsule" --web-dir=out
   ```

2. **Build the web app and prepare for Android**

   ```bash
   npm run android:build
   # This runs: npm run build && npx export -o out && npx cap add android && npx cap copy
   ```

3. **Open the project in Android Studio**

   ```bash
   npm run android:open
   # This runs: npx cap open android
   ```

4. **In Android Studio**
   - Wait for Gradle sync to complete
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

### Customizing the Android App

1. **App Icon**
   - Replace icon files in `android/app/src/main/res/mipmap-*`
   - Use Android Studio's Image Asset Studio (right-click resources folder > New > Image Asset)

2. **Splash Screen**
   - Edit files in `android/app/src/main/res/drawable`
   - Configure appearance in `capacitor.config.json`

3. **App Theme**
   - Edit `android/app/src/main/res/values/styles.xml`

4. **App Name and Package**
   - Edit in `android/app/src/main/AndroidManifest.xml`
   - Also update `android/app/build.gradle` (applicationId)

### Handling Encryption in Android Apps

Due to the sensitive nature of end-to-end encryption in mobile apps:

1. **Secure Key Storage**
   - Use Android Keystore for secure key storage
   - Implement the changes in `android/app/src/main/java/com/timecapsule/app/`

   Example code for Android Keystore integration:
   ```java
   import android.security.keystore.KeyGenParameterSpec;
   import android.security.keystore.KeyProperties;
   
   // To generate and store a key
   KeyGenParameterSpec spec = new KeyGenParameterSpec.Builder(
       "encryption_key_alias",
       KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
       .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
       .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
       .setUserAuthenticationRequired(true)
       .build();
   ```

2. **Biometric Authentication**
   - Add the BiometricPrompt API to secure key access

3. **Certificate Pinning**
   - Implement certificate pinning to prevent MITM attacks
   - Add a network security configuration XML file

## Option 2: Progressive Web App (PWA)

You can also install the TimeCapsule web app as a PWA on Android devices.

### Setup (Already Completed)

We've already set up PWA capabilities for the app:
- Added `next-pwa` package
- Created `manifest.json`
- Added PWA metadata in `layout.tsx`
- Set up service worker

### Using as an Android App

1. **Deploy the app** to a hosting provider using one of these methods:
   ```bash
   npm run deploy        # Vercel preview
   npm run deploy:prod   # Vercel production
   ```

2. **On an Android device**:
   - Open Chrome browser
   - Navigate to your deployed app URL
   - Tap the menu button (three dots)
   - Select "Add to Home Screen"
   - Follow the prompts

### Benefits of the PWA Approach

- No need for app store approval
- Automatic updates
- Smaller app size
- Shared codebase with web version

### Limitations of the PWA Approach

- Limited access to native features
- May have restrictions with some crypto operations
- Not available in Google Play Store

## Option 3: React Native (Full Native Experience)

For a fully native experience, you'd need to rewrite the app using React Native.

1. **Create a new React Native project**
   ```bash
   npx react-native init TimeCapsuleMobile
   ```

2. **Port your existing code**
   - Reuse business logic and state management
   - Replace web components with native equivalents
   - Use React Native's crypto libraries

3. **For encryption features**
   - Use `react-native-crypto` or `expo-crypto`
   - Implement secure storage with `react-native-keychain`

This approach requires more work but provides the best native experience. 