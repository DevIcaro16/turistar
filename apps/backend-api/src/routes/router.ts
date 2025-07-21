import express, { Router } from "express";
import userRouter from "./user/router";
import driverRouter from "./driver/router";
import carRouter from "./car/router";
import TourPackageRouter from "./TourPackage/router";
import TouristPointRouter from "./TouristPoint/router";
import transactionRouter from "./Transaction/router";
import adminRouter from './admin/router';

const allRoutes: Router = express.Router();

allRoutes.use("/user", userRouter);
allRoutes.use("/driver", driverRouter);
allRoutes.use("/admin", adminRouter);
allRoutes.use("/car", carRouter);
allRoutes.use("/TourPackage", TourPackageRouter);
allRoutes.use("/TouristPoint", TouristPointRouter);
allRoutes.use("/transaction", transactionRouter);

export default allRoutes;