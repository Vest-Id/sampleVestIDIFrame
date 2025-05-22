/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import NfcManager from 'react-native-nfc-manager';
import VestIDIframe from './src/VestIDIframe';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // Ensure SafeAreaView takes full screen for the WebView
  };

  useEffect(() => {
    const initNfc = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        if (isSupported) {
          await NfcManager.start();
          console.log('NFC Manager started successfully.');
        } else {
          console.warn('NFC is not supported on this device.');
        }
      } catch (ex) {
        console.warn('Error initializing NFC Manager', ex);
      }
    };

    initNfc();

    // Optional: Clean up NFC manager when the app closes or component unmounts
    // return () => {
    //   NfcManager.stop();
    // };
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <VestIDIframe 
        apiKey="ABC123-EXAMPLE-KEY"
        userEmail="user@example.com"
        campaign={true}
        fullScreen={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
