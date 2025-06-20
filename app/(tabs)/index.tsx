import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import AdminDashboardScreen from '../../Screens/Admin/AdminDashboardScreen';
import ApplicantsScreen from '../../Screens/ApplicantsScreen';
import CandidatePortal from '../../Screens/Candidates/CandidatePortal';
import MyApplicationsScreen from '../../Screens/Candidates/MyApplicationsScreen';
import ScheduleScreen from '../../Screens/Candidates/ScheduleScreen';
import EditProfileScreen from '../../Screens/EditProfileScreen';
import EmployerPortalScreen from '../../Screens/EmployerPortalScreen';
import ForgotPasswordScreen from '../../Screens/ForgotPasswordScreen';
import LandingScreen from '../../Screens/LandingScreen';
import LoginScreen from '../../Screens/LoginScreen';
import PostJobScreen from '../../Screens/PostJobScreen';
import RegisterScreen from '../../Screens/RegisterScreen';
import ViewJobsScreen from '../../Screens/ViewJobsScreen';

type RootStackParamList = {
  EmployerPortal: undefined;
  Login: undefined;
  Register: undefined;
  Landing: undefined;
  ForgotPassword: undefined;
  CandidatePortal: undefined;
  PostJobScreen: undefined;
  ViewJobs: undefined;
  Applicants: undefined;
  EditProfile: undefined;
  MyApplications: undefined;
  Schedule: undefined;
  AdminDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthNavigator() {
  // Always show Landing screen first regardless of auth state
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmployerPortal" component={EmployerPortalScreen} />
      <Stack.Screen name="CandidatePortal" component={CandidatePortal} />
      <Stack.Screen name="PostJobScreen" component={PostJobScreen} />
      <Stack.Screen name="ViewJobs" component={ViewJobsScreen} />
      <Stack.Screen name="Applicants" component={ApplicantsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyApplications" component={MyApplicationsScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />


    </Stack.Navigator>
  );
}
