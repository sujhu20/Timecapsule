# TimeCapsule Deployment Guide

This document provides detailed instructions for deploying the TimeCapsule application to various platforms, including creating an Android app version.

## Web Deployment Options

### 1. Vercel Deployment (Recommended)

Vercel is the simplest deployment platform for Next.js applications:

1. **Create a Vercel account**:
   - Visit [vercel.com](https://vercel.com) and sign up
   
2. **Install the Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy the application**:
   ```bash
   # Navigate to your project directory
   cd time-capsule
   
   # Deploy to Vercel
   vercel
   ```

5. **Follow the prompts** to configure your deployment:
   - Link to existing project or create a new one
   - Set environment variables if needed
   - Confirm deployment settings

6. **Production deployment**:
   ```bash
   vercel --prod
   ```

### 2. Netlify Deployment

1. **Create a Netlify account**:
   - Visit [netlify.com](https://netlify.com) and sign up
   
2. **Install the Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

3. **Login to Netlify**:
   ```bash
   netlify login
   ```

4. **Deploy the application**:
   ```bash
   # Navigate to your project directory
   cd time-capsule
   
   # Initialize Netlify
   netlify init
   
   # Build the application
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod
   ```

### 3. AWS Amplify Deployment

1. **Create an AWS account**:
   - Visit [aws.amazon.com](https://aws.amazon.com) and sign up
   
2. **Install the AWS Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

3. **Configure Amplify**:
   ```bash
   amplify configure
   ```

4. **Initialize Amplify in your project**:
   ```bash
   # Navigate to your project directory
   cd time-capsule
   
   # Initialize Amplify
   amplify init
   ```

5. **Add hosting**:
   ```bash
   amplify add hosting
   ```

6. **Publish your app**:
   ```bash
   amplify publish
   ```

## Android App Creation

### 1. Using Capacitor (Recommended)

[Capacitor](https://capacitorjs.com/) is a native runtime for building web applications that run natively on iOS, Android, and the web.

1. **Install Capacitor**:
   ```bash
   npm install @capacitor/core @capacitor/android
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init TimeCapsule "TimeCapsule" --web-dir=out
   ```

3. **Build your Next.js project**:
   ```bash
   npm run build
   next export -o out
   ```

4. **Add Android platform**:
   ```bash
   npx cap add android
   ```

5. **Update your capacitor.config.json**:
   ```json
   {
     "appId": "com.timecapsule.app",
     "appName": "TimeCapsule",
     "webDir": "out",
     "bundledWebRuntime": false,
     "server": {
       "androidScheme": "https"
     }
   }
   ```

6. **Copy web assets**:
   ```bash
   npx cap copy
   ```

7. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

8. **In Android Studio**:
   - Build your app: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - The APK file will be generated in `android/app/build/outputs/apk/debug/`

### 2. Using Progressive Web App (PWA)

PWAs allow users to install your web app on their mobile devices without going through an app store.

1. **We've already set up PWA functionality** with:
   - next-pwa package
   - manifest.json
   - Service worker
   - Icons

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Deploy to any web hosting**:
   - Follow one of the web deployment options above

4. **Install on Android device**:
   - Open Chrome on Android
   - Navigate to your deployed website
   - Tap the menu button (three dots)
   - Select "Add to Home Screen"
   - Follow the prompts to install

### 3. Using React Native (Full rewrite)

For a fully native experience, consider rewriting your app in React Native:

1. **Install React Native CLI**:
   ```bash
   npm install -g react-native-cli
   ```

2. **Create a new React Native project**:
   ```bash
   npx react-native init TimeCapsuleMobile
   ```

3. **Port your code**:
   - Move your business logic, services, and state management
   - Replace web components with native components
   - Use React Native's APIs for device features

4. **Run the app**:
   ```bash
   npx react-native run-android
   ```

5. **Build the APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Security Considerations for Mobile Deployment

When deploying an end-to-end encrypted application to mobile, consider these additional security requirements:

1. **Secure Key Storage**:
   - Use Android Keystore for secure key storage
   - Implement biometric authentication for key access

2. **Offline Functionality**:
   - Implement proper caching
   - Handle offline scenarios for encryption/decryption

3. **Certificate Pinning**:
   - Use SSL certificate pinning to prevent MITM attacks

4. **App Store Guidelines**:
   - Ensure compliance with Google Play Store policies
   - Include proper privacy disclosures for encryption features

## Next Steps

After deploying your application, consider:

1. **Setting up CI/CD pipelines** for automated deployments
2. **Implementing analytics** to monitor usage
3. **Configuring error tracking** services
4. **Regular security audits** of your deployment
5. **Setting up monitoring** for your production environment 