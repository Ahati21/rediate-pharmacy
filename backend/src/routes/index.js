import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import healthRoutes from './health.routes.js';
import medicineRoutes from './medicine.routes.js';
import orderRoutes from './order.routes.js';
import pharmacistRoutes from './pharmacist.routes.js';
import prescriptionRoutes from './prescription.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/health', healthRoutes);
router.use('/medicines', medicineRoutes);
router.use('/orders', orderRoutes);
router.use('/pharmacists', pharmacistRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/users', userRoutes);

export default router;
