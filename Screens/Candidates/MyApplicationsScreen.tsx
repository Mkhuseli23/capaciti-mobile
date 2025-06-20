import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { auth, db } from '../../Firebase/firebaseConfig';

type Application = {
  id: string;
  jobTitle: string;
  status: string;
  appliedAt: any; // Firestore timestamp
};

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const applicationsRef = collection(db, 'applications');
          const q = query(
            applicationsRef,
            where('candidateId', '==', user.uid),
            orderBy('appliedAt', 'desc')
          );
          const snapshot = await getDocs(q);
          const apps = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Application, 'id'>),
          }));
          setApplications(apps);
        } catch (error) {
          console.error('Error fetching applications:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setApplications([]);
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

  if (applications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noApplications}>You have not applied to any jobs yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            <Text>Status: {item.status}</Text>
            <Text>
              Applied on:{' '}
              {item.appliedAt?.toDate
                ? item.appliedAt.toDate().toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noApplications: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
