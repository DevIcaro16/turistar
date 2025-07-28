import express, { Router } from "express";
import {
    CarRegistration,
    updateCar,
    deleteCar,
    getCarById,
    getCarsByDriver,
    getCarsByAuthenticatedDriver,
    getAllCars
} from "../../controllers/car/car.controller";
import { authenticateAdmin, authenticateDriver } from "../../utils/auth/auth.middleware";
import { UploadedFile, FileArray } from 'express-fileupload';

const carRouter: Router = express.Router();

carRouter.post('/registration', authenticateDriver, CarRegistration);
carRouter.put('/:carId', authenticateDriver, updateCar);
carRouter.delete('/:carId', authenticateDriver, deleteCar);
carRouter.get('/driver', authenticateDriver, getCarsByAuthenticatedDriver);
carRouter.get('/:carId', getCarById);
carRouter.get('/driver/:driverId', authenticateDriver, getCarsByDriver);
carRouter.get('/', authenticateAdmin, getAllCars);

export default carRouter;