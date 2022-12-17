import express from 'express';
import { contactDetails, forgotPassword, getAdminStats, getAdminUsers, login, logout, myProfile, register, resetPassword } from '../controllers/user.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';


const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.post("/forgot/password", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.post("/contact", contactDetails);
router.get("/profile", isAuthenticated, myProfile);
router.get("/logout", logout);
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);
router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);


export default router;
