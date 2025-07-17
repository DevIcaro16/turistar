import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import Routes from '../routes/router';
import AuthProvider from '../contexts/auth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
