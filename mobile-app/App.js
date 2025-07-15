import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <WebView
          source={{ uri: 'https://desktop-arcade.vercel.app' }}
          style={{ flex: 1, width: '100%' }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
