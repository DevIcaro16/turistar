import express, { Router } from "express";
import { loginUser, userRegistration } from "../../controllers/user/auth.controller";

const userRouter: Router = express.Router();

userRouter.post('/user-registration', userRegistration);

userRouter.post('/user-login', loginUser);

export default userRouter;