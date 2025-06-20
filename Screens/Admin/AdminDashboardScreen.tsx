import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from '../../Firebase/firebaseConfig';

const screenWidth = Dimensions.get('window').width;

export default function AdminDashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [placementStats, setPlacementStats] = useState({ placed: 0, unplaced: 0 });
  const [jobStats, setJobStats] = useState({ total: 0, filled: 0 });
  const [alumni, setAlumni] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placementSnap = await getDocs(collection(db, 'placements'));
        let placed = 0, unplaced = 0;
        placementSnap.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'placed') placed++;
          else unplaced++;
        });
        setPlacementStats({ placed, unplaced });

        const jobSnap = await getDocs(collection(db, 'jobs'));
        let totalJobs = 0, filledJobs = 0;
        jobSnap.forEach((doc) => {
          totalJobs++;
          if (doc.data().status === 'filled') filledJobs++;
        });
        setJobStats({ total: totalJobs, filled: filledJobs });

        const alumniSnap = await getDocs(collection(db, 'alumni'));
        const alumniList = alumniSnap.docs.map((doc) => doc.data());
        setAlumni(alumniList);

      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['Placed', 'Unplaced'],
    datasets: [{ data: [placementStats.placed, placementStats.unplaced] }],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(42, 157, 244, ${opacity})`,
    labelColor: () => '#333',
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2a9df4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Admin Dashboard</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.statValue}>{placementStats.placed}</Text>
          <Text style={styles.statLabel}>Placed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#F44336' }]}>
          <Text style={styles.statValue}>{placementStats.unplaced}</Text>
          <Text style={styles.statLabel}>Unplaced</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.statValue}>{jobStats.total}</Text>
          <Text style={styles.statLabel}>Jobs Posted</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.statValue}>{jobStats.filled}</Text>
          <Text style={styles.statLabel}>Jobs Filled</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Placement Chart</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
      </View>

      {alumni.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 Alumni Career Paths</Text>
          {alumni.map((a, index) => (
            <View key={index} style={styles.alumniCard}>
              <Text style={styles.alumniName}>{a.name}</Text>
              <Text style={styles.alumniDetail}>{a.position} at {a.company}</Text>
              <Text style={styles.alumniDetail}>Class of {a.graduationYear}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F4F8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
  chart: {
    borderRadius: 12,
  },
  alumniCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  alumniName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  alumniDetail: {
    color: '#666',
  },
});
