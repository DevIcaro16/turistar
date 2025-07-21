import express, { Router } from "express";
import { driverRegistration, driverLogin, updateDriver, deleteDriver, getDriverById, meuDriver, refreshDriverToken, logoutDriver, resetUserPassword, userForgotPassword } from "../../controllers/driver/auth.controller";
import { authenticateDriver } from "../../utils/auth/auth.middleware";
import { TourRegistrationEnd, TourRegistrationStart } from "../../controllers/driver/tour_registration.controller";
import {
    getDriverTourPackages,
    getDriverReserves,
    getDriverTouristPoints,
    getDriverWallet,
    getDriverTransactions,
    getDriverMetrics
} from "../../controllers/driver/metrics.controller";
import { verifyForgotPasswordOtp } from "../../utils/auth/auth.helper";

const driverRouter: Router = express.Router();

// Auth routes
driverRouter.post('/registration', driverRegistration);
driverRouter.post('/login', driverLogin);
driverRouter.post('/logout', logoutDriver);
driverRouter.post('/refresh', refreshDriverToken);
driverRouter.post("/forgot-password-user", userForgotPassword);
driverRouter.post("/verify-forgot-password-user", verifyForgotPasswordOtp);
driverRouter.post("/reset-password-user", resetUserPassword);
driverRouter.put('/:driverId', authenticateDriver, updateDriver);
driverRouter.delete('/:driverId', authenticateDriver, deleteDriver);
driverRouter.get('/me', authenticateDriver, meuDriver);
driverRouter.get('/:driverId', authenticateDriver, getDriverById);

// Tour registration routes
driverRouter.post('/start-tourpackage', authenticateDriver, TourRegistrationStart);
driverRouter.post('/end-tourpackage', authenticateDriver, TourRegistrationEnd);

// Metrics routes
driverRouter.get('/metrics/tour-packages', authenticateDriver, getDriverTourPackages);
driverRouter.get('/metrics/reserves', authenticateDriver, getDriverReserves);
driverRouter.get('/metrics/tourist-points', authenticateDriver, getDriverTouristPoints);
driverRouter.get('/metrics/wallet', authenticateDriver, getDriverWallet);
driverRouter.get('/metrics/transactions', authenticateDriver, getDriverTransactions);
driverRouter.get('/metrics/all', authenticateDriver, getDriverMetrics);

export default driverRouter;