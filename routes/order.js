import express from 'express';
import { getAdminOrders, getOrderDetails, getOrders, paymentVerification, placeOrder, processOrders } from '../controllers/order.js';
import { authorizeAdmin, isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post("/placeorder", isAuthenticated, placeOrder);
router.post("/placeorderonline", isAuthenticated, placeOrder);
router.post("/paymentverification", isAuthenticated, paymentVerification);
router.get("/myorders", isAuthenticated, getOrders);
router.get("/order/:id", isAuthenticated, getOrderDetails);
router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);
router.get("/admin/order/:id", isAuthenticated, authorizeAdmin, processOrders);


export default router;
