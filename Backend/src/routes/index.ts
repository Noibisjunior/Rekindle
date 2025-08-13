import { Router } from 'express';
import authRoutes from '../modules/auth/authRoutes';

const r = Router();
r.use('/auth', authRoutes);


// Add other routes here as needed
// pending: r.use('/users', usersRoutes);


export default r;
