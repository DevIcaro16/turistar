import express, { Router } from "express";
import {
    CarRegistration,
    updateCar,
    deleteCar,
    getCarById,
    getCarsByDriver,
    getAllCars
} from "../../controllers/car/car.controller";
import { authenticateDriver } from "../../utils/auth/auth.middleware";

const carRouter: Router = express.Router();

// Rotas que requerem autenticação de motorista
carRouter.post('/registration', authenticateDriver, CarRegistration);
carRouter.put('/:carId', authenticateDriver, updateCar);
carRouter.delete('/:carId', authenticateDriver, deleteCar);

// Rotas públicas (apenas para visualização)
carRouter.get('/:carId', getCarById);
carRouter.get('/driver/:driverId', getCarsByDriver);
carRouter.get('/', getAllCars);

export default carRouter;