import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';
import Constants from 'expo-constants';
import Linking from 'expo-linking'

const merchantId = Constants.expoConfig?.plugins?.find(
    (p) => p[0] === "@stripe/stripe-react-native"
)?.[1].merchantIdentifier;

if (!merchantId) {
    throw new Error("É necessário configuração EXPO para stripe/stripe-react-native");
}

export default function ExpoStripeProvider(
    props: Omit<React.ComponentProps<typeof StripeProvider>, "publishableKey" | "merchantIdentifier">
) {
    return <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        merchantIdentifier={merchantId}
        urlScheme={Linking.createURL("/")?.split(":")[0]}
        {...props}
    />;
}