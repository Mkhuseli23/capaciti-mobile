import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
};

export default function LandingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/CAPCITI-LOGO.jpg')} // Fixed relative path
          style={styles.logo}
        />
        <Text style={styles.title}>CAPACITI Graduate Placement Portal</Text>
        <Text style={styles.subtitle}>Empowering graduates. Connecting employers. Driving impact.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For Graduates 🎓</Text>
        <Text style={styles.sectionText}>
          Discover job opportunities, track your applications, and build your career. Create a profile with your CV, skills, and certifications.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For Employers 💼</Text>
        <Text style={styles.sectionText}>
          Post jobs and access a curated pool of skilled, CAPACITI-trained graduates. Save time with smart candidate matching and easy interview scheduling.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>For CAPACITI Admins 📊</Text>
        <Text style={styles.sectionText}>
          Gain insights into graduate placements, employer activity, and engagement metrics. Showcase success to funders and partners.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>© {new Date().getFullYear()} CAPACITI Programme</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f8fb',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005792',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#005792',
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
  },
});
