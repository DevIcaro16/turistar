import express, { Router } from "express";
import { loginUser, userRegistration, updateUser, deleteUser, getUserById, meUser, refreshUserToken } from "../../controllers/user/auth.controller";
import { authenticateUser } from "../../utils/auth/auth.middleware";
import { ReservationsByUser, ReservationsByUserAndDate, ReserveCancellation, ReserveConfirmation, ReserveRegistration } from "../../controllers/user/reserve.controller";

const userRouter: Router = express.Router();

userRouter.get('/reservations', authenticateUser, ReservationsByUser);
userRouter.get('/reservations/today', authenticateUser, ReservationsByUserAndDate);
userRouter.post('/registration', userRegistration);
userRouter.post('/login', loginUser);
userRouter.post('/refresh', refreshUserToken);
userRouter.put('/:userId', authenticateUser, updateUser);
userRouter.delete('/:userId', authenticateUser, deleteUser);
userRouter.get('/:userId', authenticateUser, getUserById);
userRouter.get('/me', authenticateUser, meUser);
userRouter.post('/reservation', authenticateUser, ReserveRegistration);
userRouter.post('/reserve-confirmation', authenticateUser, ReserveConfirmation);
userRouter.post('/reserve-cancellation', authenticateUser, ReserveCancellation);

export default userRouter;