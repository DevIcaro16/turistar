import express from 'express';
import { createPaymentIntent } from '../../controllers/stripe/stripe.controller';
import { authenticateUser } from '../../utils/auth/auth.middleware';

const router = express.Router();
router.post('/create-payment-intent', authenticateUser, createPaymentIntent);
export default router; 