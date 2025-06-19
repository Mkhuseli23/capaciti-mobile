import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export default function ViewJobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(db, 'jobs');
        const snapshot = await getDocs(jobsRef);
        const jobList: Job[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        setJobs(jobList);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#005792" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Posted Jobs</Text>
      {jobs.length === 0 ? (
        <Text style={styles.noJobs}>No jobs found.</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJob}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  status: {
    fontSize: 12,
    color: '#007BFF',
  },
  noJobs: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
