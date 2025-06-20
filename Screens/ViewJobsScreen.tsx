import { collection, getDocs, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../Firebase/firebaseConfig';

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: Timestamp;
};

export default function ViewJobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const jobsRef = collection(db, 'jobs');
      const snapshot = await getDocs(jobsRef);
      const jobList: Job[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Job, 'id'>),
      }));

      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDeadline = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  const renderJob = ({ item }: { item: Job }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.deadline}>Deadline: {formatDeadline(item.deadline)}</Text>
    </TouchableOpacity>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchJobs();
              }}
            />
          }
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
    elevation: 2,
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
    marginBottom: 4,
  },
  deadline: {
    fontSize: 12,
    color: '#FF3E3E',
  },
  noJobs: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
