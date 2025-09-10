import { Router } from 'express';
import authRoutes from '../modules/auth/authRoutes';
import reminderRoutes from "../modules/reminders/reminderRoutes";
import connectionRoutes from "../modules/connections/connectionRoutes";
import otpRoutes from "../modules/auth/otpRoute";
import qrRoutes from "../modules/qr/qrRoutes";      

const r = Router();
r.use('/auth', authRoutes);
r.use('/', reminderRoutes);
r.use('/', connectionRoutes);
r.use('/', qrRoutes);
r.use("/otp", otpRoutes);


export default r;
