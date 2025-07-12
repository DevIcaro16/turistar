import express, { Router } from "express";
import { TourPackageRegistration } from "../../controllers/TourPackage/tourPackage.controller";
import { authenticateDriver, authenticateToken } from "../../utils/auth/auth.middleware";

const TourPackageRouter: Router = express.Router();

// Rotas que requerem autenticação de motorista
TourPackageRouter.post('/registration', authenticateDriver, TourPackageRegistration);

export default TourPackageRouter;