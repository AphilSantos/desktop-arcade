import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity, Linking } from 'react-native';
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Home Screen</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Go to Register</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

function LoginScreen() {
  const [deepLinkMessage, setDeepLinkMessage] = useState('');

  useEffect(() => {
    const handleUrl = (event) => {
      // You can parse event.url for tokens or session info
      setDeepLinkMessage('Returned from web login!');
    };
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, []);

  const openWebLogin = () => {
    Linking.openURL('https://desktop-arcade.vercel.app/login');
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Login is only available on the web.</Text>
      <TouchableOpacity style={styles.button} onPress={openWebLogin}>
        <Text style={styles.buttonText}>Open Web Login</Text>
      </TouchableOpacity>
      {deepLinkMessage ? <Text style={{ color: 'green', marginTop: 16 }}>{deepLinkMessage}</Text> : null}
    </View>
  );
}

function RegisterScreen() {
  const openWebRegistration = () => {
    Linking.openURL('https://agenticmodelmix.vercel.app/register'); // Replace with your actual registration URL
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Create an Account</Text>
      <Text style={styles.subtitle}>Registration is only available on the web.</Text>
      <TouchableOpacity style={styles.button} onPress={openWebRegistration}>
        <Text style={styles.buttonText}>Open Web Registration</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  forgotPassword: {
    color: '#7c3aed',
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
});
