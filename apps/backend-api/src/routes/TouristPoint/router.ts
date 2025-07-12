import express, { Router } from "express";
import {
    TouristPointRegistration,
    updateTouristPoint,
    deleteTouristPoint,
    getTouristPointById,
    getTouristPointsByDriver,
    getAllTouristPoints
} from "../../controllers/TouristPoint/touristPoint.controller";
import { authenticateDriver, authenticateToken } from "../../utils/auth/auth.middleware";

const TouristPointRouter: Router = express.Router();

// Rotas que requerem autenticação de motorista
TouristPointRouter.post('/registration', authenticateDriver, TouristPointRegistration);
TouristPointRouter.put('/:touristPointId', authenticateDriver, updateTouristPoint);
TouristPointRouter.delete('/:touristPointId', authenticateDriver, deleteTouristPoint);

// Rotas de consulta (algumas requerem autenticação)
TouristPointRouter.get('/:touristPointId', authenticateDriver, getTouristPointById);
TouristPointRouter.get('/driver/:driverId', getTouristPointsByDriver);
TouristPointRouter.get('/', authenticateToken, getAllTouristPoints);

export default TouristPointRouter;