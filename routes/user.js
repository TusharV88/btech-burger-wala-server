import express from 'express';
import passport from 'passport';
import { contactDetails, getAdminStats, getAdminUsers, logout, myProfile } from '../controllers/user.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';


const router = express.Router();

export const routerHeaders = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://btechburgerwala-tau.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};


router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile"],
}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "https://btechburgerwala-tau.vercel.app",
}));

router.post("/contact", contactDetails);
router.get("/profile", routerHeaders, isAuthenticated, myProfile);
router.get("/logout", logout);
router.get("/admin/users", routerHeaders, isAuthenticated, authorizeAdmin, getAdminUsers);
router.get("/admin/stats", routerHeaders, isAuthenticated, authorizeAdmin, getAdminStats);


export default router;
