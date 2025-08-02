import Stripe from 'stripe';
import { config } from '../config';

export const stripe = new Stripe(
    config.stripeSecretKey,
    {
        apiVersion: "2025-06-30.basil",
        appInfo: {
            name: "app_passeios_turisticos"
        }
    }
);