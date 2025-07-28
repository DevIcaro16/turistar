import express, { Router } from "express";
import {
    TourPackageRegistration,
    updateTourPackage,
    deleteTourPackage,
    getTourPackageById,
    getTourPackagesByDriver,
    getAllTourPackages,
    searchTourPackages
} from "../../controllers/TourPackage/tourPackage.controller";
import { authenticateDriver, authenticateToken } from "../../utils/auth/auth.middleware";

const TourPackageRouter: Router = express.Router();

TourPackageRouter.post('/registration', authenticateDriver, TourPackageRegistration);
TourPackageRouter.put('/:tourPackageId', authenticateDriver, updateTourPackage);
TourPackageRouter.delete('/:tourPackageId', authenticateDriver, deleteTourPackage);
TourPackageRouter.get('/:tourPackageId', authenticateToken, getTourPackageById);
TourPackageRouter.get('/driver/:driverId', authenticateToken, getTourPackagesByDriver);
TourPackageRouter.get('/', authenticateToken, getAllTourPackages);
TourPackageRouter.get('/search', authenticateToken, searchTourPackages);

export default TourPackageRouter;