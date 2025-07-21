import Stripe from 'stripe';
import { Request, Response, NextFunction } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-06-30.basil' });

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, currency = 'brl', metadata } = req.body;
        // amount deve ser em centavos!
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata,
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};  