import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CandidatePortal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Candidate Portal</Text>
      <Text>Welcome to the Candidate Portal screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
