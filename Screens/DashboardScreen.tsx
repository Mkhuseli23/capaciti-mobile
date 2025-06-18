import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './types';

export default function EmployerDashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../assets/images/CAPCITI-LOGO.jpg')} style={styles.logo} />
        <Text style={styles.header}>Employer Dashboard</Text>
        <View style={styles.card}><Text style={styles.cardText}>Post Job Opportunities</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Matched Candidates</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Interview Schedule</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Applicant Tracker</Text></View>
        <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function GraduateDashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../assets/images/CAPCITI-LOGO.jpg')} style={styles.logo} />
        <Text style={styles.header}>Graduate Dashboard</Text>
        <View style={styles.card}><Text style={styles.cardText}>Profile & CV</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Job Matching Feed</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Application Tracker</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Alumni Career Path</Text></View>
        <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export function AdminDashboard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={require('../assets/images/CAPCITI-LOGO.jpg')} style={styles.logo} />
        <Text style={styles.header}>Admin & Impact Dashboard</Text>
        <View style={styles.card}><Text style={styles.cardText}>Alumni Placement Tracking</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Placement Analytics</Text></View>
        <View style={styles.card}><Text style={styles.cardText}>Employer Engagement</Text></View>
        <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#005792',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  logout: {
    marginTop: 30,
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
