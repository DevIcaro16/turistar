import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import Routes from '../routes/router';
import AuthProvider from '../contexts/auth';
import { StripeProvider } from '@stripe/stripe-react-native';


export default function App() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </StripeProvider>
  );
}
