import express from 'express';
import { getAdminOrders, getOrderDetails, getOrders, paymentVerification, placeOrder, processOrders } from '../controllers/order.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';
import { routeHeaders } from '../routes/user.js';

const router = express.Router();

router.post("/placeorder", routeHeaders, isAuthenticated, placeOrder);
router.post("/placeorderonline", routeHeaders, isAuthenticated, placeOrder);
router.post("/paymentverification", routeHeaders, isAuthenticated, paymentVerification);
router.get("/myorders", routeHeaders, isAuthenticated, getOrders);
router.get("/order/:id", routeHeaders, isAuthenticated, getOrderDetails);
router.get("/admin/orders", routeHeaders, isAuthenticated, authorizeAdmin, getAdminOrders);
router.get("/admin/order/:id", routeHeaders, isAuthenticated, authorizeAdmin, processOrders);


export default router;
