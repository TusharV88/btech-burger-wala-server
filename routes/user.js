import express from 'express';
import passport from 'passport';
import { contactDetails, getAdminStats, getAdminUsers, logout, myProfile } from '../controllers/user.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';


const router = express.Router();


router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile"],
}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "https://btechburgerwala-tau.vercel.app",
}));

router.post("/contact", contactDetails);
router.get("/profile", isAuthenticated, myProfile);
router.get("/logout", logout);
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);
router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);


export default router;
