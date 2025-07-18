import express, { Router } from "express";
import {
    getTransactionsByType,
    getUserTransactions,
    getDriverTransactions,
    getUserTransactionTotals,
    getDriverTransactionTotals,
    getAllTransactions,
    getGeneralTransactionTotals,
    getDriverAllTransactions
} from "../../controllers/Transaction/transaction.controller";
import { authenticateToken, authenticateUser } from "../../utils/auth/auth.middleware";
import { authenticateDriver } from "../../utils/auth/auth.middleware";

const transactionRouter: Router = express.Router();

transactionRouter.get('/user/transactions', authenticateUser, getUserTransactions);
transactionRouter.get('/user/totals', authenticateUser, getUserTransactionTotals);
transactionRouter.get('/driver/transactions', authenticateDriver, getDriverTransactions);
transactionRouter.get('/driver/all', authenticateDriver, getDriverAllTransactions);
transactionRouter.get('/driver/totals', authenticateDriver, getDriverTransactionTotals);
transactionRouter.get('/type/:type', authenticateToken, getTransactionsByType);
transactionRouter.get('/all', authenticateToken, getAllTransactions);
transactionRouter.get('/totals', authenticateToken, getGeneralTransactionTotals);

export default transactionRouter;
