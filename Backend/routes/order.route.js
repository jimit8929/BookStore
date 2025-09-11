import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { confirmPayment, createOrder, deleteOrder, getOrderById, getOrders, getUserOrders, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

//Protected Routes
router.post("/" , authMiddleware , createOrder);
router.post("/confirm" , authMiddleware , confirmPayment);

//Public Routes
router.get("/" , getOrders);
router.get("/user" , authMiddleware , getUserOrders);
router.get("/:id" , getOrderById);
router.put("/:id" , updateOrder);
router.delete('/:id' , deleteOrder);

export default router;