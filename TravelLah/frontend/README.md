# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

----------------------------------------------------------------------------------------------------------

# Travellah Frontend

This is the frontend application for **Travellah**, a travel planning app built using **Expo** and **React Native**.

## 🚀 Getting Started

Follow these steps to set up and run the application locally:

### 1. Clone the Repository (if applicable)
```bash
# If the project is in a repository
git clone <repository_url>
cd Travellah/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npx expo start
```

The Expo development server will open a web-based interface in your browser. From there, you can scan the QR code using the Expo Go app on your mobile device or run the app on an emulator.

## 📱 Running on Devices

- **Android**: Scan the QR code with Expo Go.
- **iOS**: Open the Camera app on iOS and scan the QR code.

### 💻 Running on Emulators
Ensure you have installed:
- **Android Studio** (with an active emulator)
- **Xcode** (for iOS, macOS only)

## 🛠️ Project Structure
```
frontend/
   ├── App.js
   ├── package.json
   ├── babel.config.js
   ├── node_modules/
   ├── assets/
   ├── components/
   ├── screens/
   └── utils/
```

## 📦 Key Dependencies
- **React Native**
- **Expo**
- **React Navigation**

## 🐛 Troubleshooting
- **Clear Cache:**
  ```bash
  expo start --clear
  ```
- **Ensure Emulator is Running:**
  ```bash
  adb devices
  ```

## 🌐 Useful Commands
- **Start Project:** `npx expo start`
- **Run on iOS:** `npm run ios`
- **Run on Android:** `npm run android`
- **Build APK:** `eas build --platform android`

## 📝 Additional Information
Refer to the [Expo Documentation](https://docs.expo.dev/) for more details.

---

Happy coding! 🎉


