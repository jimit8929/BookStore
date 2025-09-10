import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {addToCart, clearUserCart, getCart, removeCartItem, updateCart} from "../controllers/cart.controller.js"

const router = express.Router();


router.post("/add" , authMiddleware , addToCart);
router.get("/" , authMiddleware , getCart);
router.put("/update" , authMiddleware , updateCart);
router.delete("/remove/:bookId" , authMiddleware , removeCartItem);
router.delete("/clear" , authMiddleware , clearUserCart);


export default router;