import { Router } from 'express';
import authRoutes from '../modules/auth/authRoutes';
import reminderRoutes from "../modules/reminders/reminderRoutes";

const r = Router();
r.use('/auth', authRoutes);
r.use('/', reminderRoutes);


export default r;
