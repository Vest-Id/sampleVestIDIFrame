import React, { useRef } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

type VestIDIframeProps = {
  apiKey: string;
  userEmail: string;
  campaign: boolean;
  fullScreen: boolean;
};

const VestIDIframe: React.FC<VestIDIframeProps> = ({ apiKey, userEmail, campaign, fullScreen }) => {
  const webViewRef = useRef<WebView>(null);
  // Puedes pasar los parámetros por querystring si tu web lo requiere
  const initialUrl = `https://5340-2806-230-103c-3c6c-9c1c-b164-e9c8-16cf.ngrok-free.app/accounts/login?apiKey=${encodeURIComponent(apiKey)}&userEmail=${encodeURIComponent(userEmail)}&campaign=${campaign}&fullScreen=${fullScreen}`;


  // Function to initiate NFC Scan, called from WebView via postMessage
  const handleScanNFC = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag) {
        const uid = tag!.id;

        const formattedUid =
          uid!
            .match(/.{1,2}/g)
            ?.join(':')
            .toUpperCase() || uid;
        const tagDataForWebView = { id: formattedUid, type: tag.type, ndefMessage: tag.ndefMessage };

       
        webViewRef.current?.injectJavaScript(`
          if (typeof onNFCScanned === 'function') {
            onNFCScanned(${JSON.stringify(tagDataForWebView)});
          }
          true;
        `);
      }
    } catch (ex: any) {
      Alert.alert('NFC Error', ex.message || 'Failed to scan NFC tag.');
      webViewRef.current?.injectJavaScript(`
        if (typeof onNFCScanError === 'function') {
          onNFCScanError(${JSON.stringify(ex.message || String(ex))});
        }
        true;
      `);
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
  };

  // Handle messages from WebView
  const onMessage = (event: WebViewMessageEvent) => {
    const { data } = event.nativeEvent;
    console.log('Received message from WebView:', data);
    try {
      const message = JSON.parse(data);
      if (message.type === 'scanNFC') {
        handleScanNFC();
      }
    } catch (error) {
      // Ignore parsing errors
    }
  };

  // JavaScript to inject into the WebView
  const injectedJavaScript = `
    window.scanNFC = function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'scanNFC' }));
    };
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialUrl }}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mixedContentMode={Platform.OS === 'android' ? 'compatibility' : undefined}
        allowsBackForwardNavigationGestures={true}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        style={styles.webview}
        onError={({ nativeEvent }) => {
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={({ nativeEvent }) => {
          console.warn('WebView HTTP error: ', nativeEvent.url, nativeEvent.statusCode, nativeEvent.description);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default VestIDIframe;
