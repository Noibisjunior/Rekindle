import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { signupSchema, loginSchema, googleTokenSchema } from './authModel';
import * as ctrl from './authController';
import { requireAuth } from '../../middleware/auth';
import { updateProfileSchema } from "../users/userSchema";
import { upload } from "../../middleware/upload";

const r = Router();

r.post('/signup', validate(signupSchema), ctrl.signup);
r.post('/login', validate(loginSchema), ctrl.login);

// Google authentication route
// This route expects an idToken from the frontend
r.post('/google', validate(googleTokenSchema), ctrl.google);

// Protected route to get and update the current user's info
r.get('/me', requireAuth, ctrl.me);
r.put("/me", requireAuth, validate(updateProfileSchema), ctrl.updateMe);
r.post("/me/photo", requireAuth, upload.single("photo"), ctrl.uploadPhoto);

export default r;
