import express, { Router } from "express";
import { loginUser, userRegistration, updateUser, deleteUser, getUserById } from "../../controllers/user/auth.controller";

const userRouter: Router = express.Router();

userRouter.post('/registration', userRegistration);
userRouter.post('/login', loginUser);
userRouter.put('/:userId', updateUser);
userRouter.delete('/:userId', deleteUser);
userRouter.get('/:userId', getUserById);

export default userRouter;