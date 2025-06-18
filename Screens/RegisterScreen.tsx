import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../Firebase/firebaseConfig';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
  const isStrongPassword = (pwd: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(pwd);

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!isStrongPassword(password)) {
      setErrorMessage('Password must include letters, numbers, and a special character (min 6 characters).');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${name} ${surname}`,
      });

      await sendEmailVerification(user);

      setErrorMessage('');
      navigation.navigate('Login');
    } catch (error: any) {
      let message = 'Something went wrong. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      }
      setErrorMessage(message);
    }
  };

  return (
    <View style={styles.fullScreenWhite}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../assets/images/CAPCITI-LOGO.jpg')} style={styles.logo} />

        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Join the CAPACITI Graduate Portal</Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <FontAwesome name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrorMessage('');
              }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="user" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Surname"
              style={styles.input}
              value={surname}
              onChangeText={(text) => {
                setSurname(text);
                setErrorMessage('');
              }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorMessage('');
              }}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>
              Already have an account? <Text style={styles.registerLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>© {new Date().getFullYear()} CAPACITI Programme</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWhite: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    borderColor: '#ff4d4d',
    borderWidth: 1,
    width: '100%',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  button: {
    backgroundColor: '#005792',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  registerText: {
    marginTop: 20,
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#005792',
    fontWeight: '600',
  },
  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
  },
});
