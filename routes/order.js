import express from 'express';
import { getAdminOrders, getOrderDetails, getOrders, paymentVerification, placeOrder, processOrders } from '../controllers/order.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';
import { routerHeaders } from './user.js';

const router = express.Router();

router.post("/placeorder", routerHeaders, isAuthenticated, placeOrder);
router.post("/placeorderonline", routerHeaders, isAuthenticated, placeOrder);
router.post("/paymentverification", routerHeaders, isAuthenticated, paymentVerification);
router.get("/myorders", routerHeaders, isAuthenticated, getOrders);
router.get("/order/:id", routerHeaders, isAuthenticated, getOrderDetails);
router.get("/admin/orders", routerHeaders, isAuthenticated, authorizeAdmin, getAdminOrders);
router.get("/admin/order/:id", routerHeaders, isAuthenticated, authorizeAdmin, processOrders);


export default router;
