import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth, db } from '../../Firebase/firebaseConfig';
import { RootStackParamList } from '../types'; // Adjust path if needed

export default function CandidatePortalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigation.navigate('Login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);

          // Fetch jobs (basic matching by skill tag)
          const jobSnapshot = await getDocs(collection(db, 'jobs'));
          const allJobs = jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          const skills = userData.skills || [];

          const matches = allJobs.filter((job: any) =>
            skills.some((skill: string) => job.title.toLowerCase().includes(skill.toLowerCase()))
          );

          setMatchedJobs(matches);
        }
      } catch (error) {
        console.error('Candidate portal error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a9df4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Candidate Portal</Text>

      {user && (
        <Text style={styles.welcome}>
          Welcome, {user.name} {user.surname} 👋
        </Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Matched Jobs</Text>
        {matchedJobs.length === 0 ? (
          <Text style={styles.noData}>No matching jobs found yet.</Text>
        ) : (
          <FlatList
            data={matchedJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.jobCard}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.jobStatus}>Status: {item.status}</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="user" size={18} color="#fff" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MyApplications')}
        >
          <Icon name="file-text" size={18} color="#fff" />
          <Text style={styles.buttonText}>My Applications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Icon name="calendar" size={18} color="#fff" />
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    marginBottom: 12,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  jobTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  jobStatus: {
    color: '#007BFF',
    fontSize: 12,
    marginTop: 6,
  },
  noData: {
    textAlign: 'center',
    color: '#777',
    marginTop: 12,
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#2a9df4',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '48%',
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
});
