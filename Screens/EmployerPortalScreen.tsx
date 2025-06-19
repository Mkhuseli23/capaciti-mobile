import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../Firebase/firebaseConfig';
import { RootStackParamList } from './types'; // Adjust path if needed

export default function EmployerPortalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(null);
  const [recentActivity] = useState([
    { id: '1', title: 'Software Engineer', applicants: 10, status: 'Open' },
    { id: '2', title: 'UI Designer', applicants: 7, status: 'Interviewing' },
    { id: '3', title: 'QA Tester', applicants: 4, status: 'Closed' },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.warn('No profile found in users collection');
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Employer Portal</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {user ? (
        <Text style={styles.welcome}>
          Welcome back, {user.name} {user.surname} 👋
        </Text>
      ) : (
        <ActivityIndicator size="small" color="#2a9df4" style={{ marginVertical: 10 }} />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('PostJobScreen')}
        >
          <Icon name="plus" size={18} color="#fff" />
          <Text style={styles.buttonText}>Post Job</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ViewJobs')}
        >
          <Icon name="list" size={18} color="#fff" />
          <Text style={styles.buttonText}>View Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Applicants')}
        >
          <Icon name="users" size={18} color="#fff" />
          <Text style={styles.buttonText}>Applicants</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="building" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>15</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Interviews</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <FlatList
        data={recentActivity}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text>
              {item.applicants} Applicants – {item.status}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 16,
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2a9df4',
    padding: 10,
    width: '48%',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 14,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  activityItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  jobTitle: {
    fontWeight: '600',
  },
});
