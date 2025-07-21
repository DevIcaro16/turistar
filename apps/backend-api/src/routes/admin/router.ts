import express from 'express';
import {
    registerAdmin,
    loginAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword,
    forgotAdminPassword,
    refreshAdminToken,
    logoutAdmin
} from '../../controllers/admin/auth.controller';
import { authenticateAdmin } from '../../utils/auth/auth.middleware';
import {
    getAllUsers,
    getAllDrivers,
    getAllTourPackages,
    getAllReserves,
    getAllTouristPoints,
    getPlatformRevenue,
    getAllMetrics
} from '../../controllers/admin/metrics.controller';

const adminRouter = express.Router();

// Auth routes
adminRouter.post('/registration', registerAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/logout', logoutAdmin);
adminRouter.get('/me', authenticateAdmin, getAdminById);
adminRouter.put('/me', authenticateAdmin, updateAdmin);
adminRouter.delete('/me', authenticateAdmin, deleteAdmin);
adminRouter.post('/reset-password', resetAdminPassword);
adminRouter.post('/forgot-password', forgotAdminPassword);
adminRouter.post('/refresh', refreshAdminToken);

// Metrics routes
adminRouter.get('/metrics/users', authenticateAdmin, getAllUsers);
adminRouter.get('/metrics/drivers', authenticateAdmin, getAllDrivers);
adminRouter.get('/metrics/tour-packages', authenticateAdmin, getAllTourPackages);
adminRouter.get('/metrics/reserves', authenticateAdmin, getAllReserves);
adminRouter.get('/metrics/tourist-points', authenticateAdmin, getAllTouristPoints);
adminRouter.get('/metrics/platform-revenue', authenticateAdmin, getPlatformRevenue);
adminRouter.get('/metrics/all', authenticateAdmin, getAllMetrics);

export default adminRouter;