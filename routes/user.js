import express from 'express';
import passport from 'passport';
import { contactDetails, getAdminStats, getAdminUsers, logout, myProfile } from '../controllers/user.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';


const router = express.Router();

export const routeHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};


router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile"],
}));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
}));

router.post("/contact", routeHeaders, contactDetails);
router.get("/profile", routeHeaders, isAuthenticated, myProfile);
router.get("/logout", routeHeaders, logout);
router.get("/admin/users", routeHeaders, isAuthenticated, authorizeAdmin, getAdminUsers);
router.get("/admin/stats", routeHeaders, isAuthenticated, authorizeAdmin, getAdminStats);


export default router;
