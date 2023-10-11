import express from "express";
const router = express.Router();
import {signUp,login,getProfile,updatemail}  from "../controllers/userControllers.js";
import authenticateUser from "../middleware/authMiddleware.js";

router.post("/signup", signUp);

router.post("/login",login);

router.get('/profile', authenticateUser,getProfile);

router.put('/update/email', authenticateUser,updatemail);

export default router;