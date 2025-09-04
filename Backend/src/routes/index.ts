import { Router } from 'express';
import authRoutes from '../modules/auth/authRoutes';
import reminderRoutes from "../modules/reminders/reminderRoutes";
import otpRoutes from "../modules/auth/otpRoute";

const r = Router();
r.use('/auth', authRoutes);
r.use('/', reminderRoutes);
r.use("/otp", otpRoutes);


export default r;
