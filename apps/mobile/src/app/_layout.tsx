import { Stack } from 'expo-router';
import AuthProvider from '../contexts/auth';
import { StripeProvider } from '@stripe/stripe-react-native';
import { StatusBar } from 'react-native';
import { config } from '../util/config';

export default function RootLayout() {

    return (

        <StripeProvider publishableKey={config.stripePublishableKey}>
            <AuthProvider>
                <StatusBar backgroundColor="#F0F4FF" barStyle="dark-content" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                </Stack>
            </AuthProvider>
        </StripeProvider>
    );
} 