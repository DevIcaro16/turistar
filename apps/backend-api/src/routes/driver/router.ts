import express, { Router } from "express";
import { driverRegistration, driverLogin, updateDriver, deleteDriver, getDriverById } from "../../controllers/driver/auth.controller";

const driverRouter: Router = express.Router();

driverRouter.post('/registration', driverRegistration);
driverRouter.post('/login', driverLogin);
driverRouter.put('/:driverId', updateDriver);
driverRouter.delete('/:driverId', deleteDriver);
driverRouter.get('/:driverId', getDriverById);

export default driverRouter;