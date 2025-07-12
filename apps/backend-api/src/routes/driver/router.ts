import express, { Router } from "express";
import { driverLogin, driverRegistration } from "../../controllers/driver/auth.controller";

const driverRouter: Router = express.Router();

driverRouter.post('/driver-registration', driverRegistration);

driverRouter.post('/login-driver', driverLogin);

export default driverRouter;