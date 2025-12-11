import express from 'express';
const router = express.Router();
import { auth } from '../controllers/auth.js';
import authenticate from '../middlewares/restrict.js';

// Signup route
router.post('/signup', auth.signup);


router.post('/login', auth.login);
router.post("/reset-password", auth.resetPassword);
router.post("/set-password", auth.setPassword);
router.get("/verify-email", auth.verifyEmail);

router.get('/userProfile', authenticate, auth.userProfile);
router.put('/updateProfile', auth.updateProfile);

export default router;
