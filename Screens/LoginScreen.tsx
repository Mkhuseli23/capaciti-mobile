import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../Firebase/firebaseConfig'; // Make sure db is Firestore instance

type RootStackParamList = {
  Landing: undefined;
  Login: { role: string };
  Register: undefined;
  ForgotPassword: undefined;
  CandidateDashboard: undefined;
  EmployeeDashboard: undefined;
  AdminDashboard: undefined;
  EmployerPortal: undefined;
  CandidatePortal: undefined;
};

export default function LandingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check auth state & redirect based on role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || 'Candidate'; // default to Candidate if no role

            if (role === 'Candidate') {
              navigation.replace('CandidatePortal');
            } else if (role === 'Employee') {
              navigation.replace('EmployerPortal');
            } else if (role === 'Admin') {
              navigation.replace('AdminDashboard');
            } else {
              // Unknown role fallback
              navigation.replace('Landing');
            }
          } else {
            // No user data in Firestore — fallback or sign out
            navigation.replace('Landing');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          navigation.replace('Landing');
        }
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'Candidate';

        if (role === 'Candidate') {
          navigation.replace('CandidateDashboard');
        } else if (role === 'Employee') {
          navigation.replace('EmployeeDashboard');
        } else if (role === 'Admin') {
          navigation.replace('AdminDashboard');
        } else {
          alert('User role is undefined, please contact support.');
          setLoading(false);
        }
      } else {
        alert('User data not found, please contact support.');
        setLoading(false);
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.fullScreenWhite}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../assets/images/CAPCITI-LOGO.jpg')}
          style={styles.logo}
          accessibilityLabel="CAPACITI logo"
        />
        <Text style={styles.title}>CAPACITI Graduate Portal</Text>
        <Text style={styles.subtitle}>Empowering graduates. Connecting employers.</Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="email" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="lock" size={20} color="#555" style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading ? { opacity: 0.7 } : {}]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
            <FontAwesome name="google" size={20} color="#DB4437" style={styles.icon} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>
              Don’t have an account? <Text style={styles.registerLink}>Click here</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.registerText}>
              Forgot Password? <Text style={styles.registerLink}>Click here</Text>
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
    marginBottom: 40,
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
    marginBottom: 20,
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
    ...Platform.select({
      android: { elevation: 1 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
    }),
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  googleText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#333',
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
