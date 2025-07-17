import express, { Router } from "express";
import { driverRegistration, driverLogin, updateDriver, deleteDriver, getDriverById, meuDriver } from "../../controllers/driver/auth.controller";
import { authenticateDriver } from "../../utils/auth/auth.middleware";
import { TourRegistrationEnd, TourRegistrationStart } from "../../controllers/driver/tour_registration.controller";

const driverRouter: Router = express.Router();

driverRouter.post('/registration', driverRegistration);
driverRouter.post('/login', driverLogin);
driverRouter.put('/:driverId', authenticateDriver, updateDriver);
driverRouter.delete('/:driverId', authenticateDriver, deleteDriver);
driverRouter.post('/start-tourpackage', authenticateDriver, TourRegistrationStart);
driverRouter.post('/end-tourpackage', authenticateDriver, TourRegistrationEnd);
driverRouter.get('/me', authenticateDriver, meuDriver);
driverRouter.get('/:driverId', authenticateDriver, getDriverById);

export default driverRouter;