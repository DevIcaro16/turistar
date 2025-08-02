import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import Linking from 'expo-linking'
import { Alert, Button } from "react-native";
import api from '../util/api/api';

export default function CheckoutForm({ amount }: { amount: number }) {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPaymentSheetParams = async () => {
        try {
            console.log('🔄 Buscando parâmetros do PaymentSheet...');

            const response = await api.post('/stripe/create-payment-intent', {
                amount: amount * 100, // Converter para centavos
                currency: 'brl',
                metadata: {
                    source: 'checkout-form',
                    amount: amount.toString()
                }
            });

            console.log('✅ Parâmetros recebidos:', response.data);

            return {
                paymentIntent: response.data.clientSecret,
                ephemeralKey: null, // Não estamos usando ephemeral key
                customer: null // Não estamos usando customer
            };
        } catch (error) {
            console.error('❌ Erro ao buscar parâmetros:', error);
            throw error;
        }
    };

    const initializePaymentSheet = async () => {

        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Turistar, Inc.",
            customerId: customer || undefined,
            customerEphemeralKeySecret: ephemeralKey || undefined,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: "Icaro Cliente",
                email: "icaro.micromoney@gmail.com",
                phone: "85981427452"
            },
            returnURL: Linking.createURL("stripe-redirect"),
            googlePay: {
                merchantCountryCode: "BR"
            }
        });

        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, `${error.message}`);
        } else {
            Alert.alert('Sucesso', 'Seu pedido foi confirmado!');
        }
    };

    return (
        <>
            <Button title="Iniciar Pagamento" onPress={() => { initializePaymentSheet() }} />;
            <Button title="Abrir modal de pagamento" onPress={() => { openPaymentSheet() }} />;
        </>
    );

}