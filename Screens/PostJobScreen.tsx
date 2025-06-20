import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { auth, db } from '../Firebase/firebaseConfig';

type RootStackParamList = {
  EmployerPortal: undefined;
};

export default function PostJobScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostJob = async () => {
    if (!title || !description || !location || !jobType || !salary || !deadline) {
      Alert.alert('Error', 'Please fill in all fields including deadline.');
      return;
    }

    const employerId = auth.currentUser?.uid;
    if (!employerId) {
      Alert.alert('Error', 'You must be logged in to post a job.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        description,
        location,
        jobType,
        salary,
        deadline: Timestamp.fromDate(deadline),
        createdAt: serverTimestamp(),
        employerId,
      });

      Alert.alert('Success', 'Job posted successfully!');
      navigation.navigate('EmployerPortal');
    } catch (error) {
      console.error('Post job error:', error);
      Alert.alert('Error', 'Failed to post job. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Post a New Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Job Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Type (e.g. Full-time, Remote)"
        value={jobType}
        onChangeText={setJobType}
      />
      <TextInput
        style={styles.input}
        placeholder="Salary"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.dateButton} onPress={showPicker}>
        <Text style={styles.dateButtonText}>
          {deadline
            ? `Deadline: ${deadline.toDateString()}`
            : 'Select Deadline Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handlePostJob}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Post Job'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#005792',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
});
