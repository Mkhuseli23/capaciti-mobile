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

type ScheduleItem = {
  id: string;
  title: string;
  date: any; // Firestore timestamp
  location?: string;
  notes?: string;
};

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const schedulesRef = collection(db, 'schedules');
          const q = query(
            schedulesRef,
            where('userId', '==', user.uid),
            orderBy('date', 'asc')
          );
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<ScheduleItem, 'id'>),
          }));
          setSchedules(items);
        } catch (error) {
          console.error('Error fetching schedules:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setSchedules([]);
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

  if (schedules.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSchedules}>No scheduled events yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Schedule</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>
              Date:{' '}
              {item.date?.toDate
                ? item.date.toDate().toLocaleString()
                : 'N/A'}
            </Text>
            {item.location && <Text>Location: {item.location}</Text>}
            {item.notes && <Text>Notes: {item.notes}</Text>}
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
  noSchedules: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});
