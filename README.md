![Logo](./assets/logo.png)

# VestIDIframe React Native Component

This project demonstrates how to embed a secure WebView iFrame with native NFC scanning capabilities for both iOS and Android using React Native.

---

## 0. Copy the Component File

First, copy the file [`src/VestIDIframe.tsx`](./src/VestIDIframe.tsx) from this repository to your project's source directory. For example:

```
cp ./src/VestIDIframe.tsx <your-project>/src/VestIDIframe.tsx
```

---

## 1. Library Installation

Install the required dependencies for NFC and WebView support:

```bash
npm install react-native-webview react-native-nfc-manager
# or
yarn add react-native-webview react-native-nfc-manager
```

For iOS, install CocoaPods:
```bash
cd ios
pod install
cd ..
```

---

## 2. Native NFC Configuration

### iOS

1. **Enable NFC capability in Xcode:**
   - Open your project in Xcode.
   - Go to your app target > "Signing & Capabilities".
   - Click "+ Capability" and add "Near Field Communication Tag Reading".

2. **Edit `Info.plist`:**
   Add the following keys:
   ```xml
   <key>NFCReaderUsageDescription</key>
   <string>This app uses NFC to scan tags.</string>
   <key>com.apple.developer.nfc.readersession.formats</key>
   <array>
     <string>NDEF</string>
   </array>
   ```
   If you use HTTP or local IPs in development, add exceptions under `NSAppTransportSecurity`:
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
     <key>NSExceptionDomains</key>
     <dict>
       <key>secure.vest-id.com</key>
       <dict>
         <key>NSExceptionAllowsInsecureHTTPLoads</key>
         <true/>
         <key>NSIncludesSubdomains</key>
         <true/>
       </dict>
       <!-- Add other IPs/domains as needed -->
     </dict>
   </dict>
   ```

### Android

1. **Edit `android/app/src/main/AndroidManifest.xml`:**
   Add these permissions:
   ```xml
   <uses-permission android:name="android.permission.NFC" />
   <uses-feature android:name="android.hardware.nfc" android:required="true" />
   <uses-permission android:name="android.permission.INTERNET" />
   ```

---

## 3. Component Usage

Import and use the `VestIDIframe` component in your React Native app:

```tsx
import VestIDIframe from './src/VestIDIframe';

<VestIDIframe
  apiKey="ABC123-EXAMPLE-KEY"
  userEmail="user@example.com"
  campaign={true}
  fullScreen={false}
/>
```

---

## 4. How the iFrame Works

- The component renders a WebView pointing to your web app, passing parameters via the query string.
- It injects a JavaScript bridge so your web app can call `window.scanNFC()` to trigger a native NFC scan.
- When a tag is scanned, the native code calls `window.onNFCScanned(tagData)` in your web app with the tag info.
- If an error occurs, it calls `window.onNFCScanError(errorMessage)`.

### Example: Calling NFC from your Web App

```js
// To trigger an NFC scan from your web page:
window.scanNFC && window.scanNFC();

// To receive the result:
window.onNFCScanned = function(tagData) {
  alert('NFC Tag: ' + JSON.stringify(tagData));
};
window.onNFCScanError = function(error) {
  alert('NFC Error: ' + error);
};
```

---

## 5. Component Parameters

| Prop        | Type     | Required | Description                                              |
|-------------|----------|----------|----------------------------------------------------------|
| apiKey      | string   | Yes      | API key for club authenticatio and rebranding.           |
| userEmail   | string   | Yes      | Email of the current user to autoauthenticate.           |
| campaign    | boolean  | Yes      | Show only campaign page.                                 |
| fullScreen  | boolean  | Yes      | Display all the webapp including the header and footer.  |

All parameters are passed to the web app via the query string in the WebView URL.

---

## 6. Running the Demo App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/NFCAPP.git
   cd NFCAPP/NFCAPP
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Install iOS pods:**
   ```bash
   cd ios
   pod install
   cd ..
   ```
4. **Run the app:**
   - For iOS:
     ```bash
     npx react-native run-ios
     ```
   - For Android:
     ```bash
     npx react-native run-android
     ```

---

## Demo APK

[Download Demo APK](https://drive.google.com/file/d/1WcxWRuFJkFcir-hY7vpalP2BgL2KFJdM/view?usp=share_link)

---

For any questions or improvements, please open an issue or contact the maintainer.
