import express from "express";
const router = express.Router();
import {followUser,unfollowUser,getFollowers,getFollowing,register,login,getProfile,updateUserProfile,deleteUser,sendOTP}  from "../controllers/userControllers.js";
import authenticateUser from "../middleware/authMiddleware.js";

router.post("/register", register);

router.post("/sendotp", sendOTP);

router.post("/login",login);

router.get('/profile', authenticateUser,getProfile);

router.put('/update', authenticateUser,updateUserProfile);

router.delete("/delete", authenticateUser, deleteUser);

router.post("/follow", authenticateUser, followUser);

router.post("/unfollow", authenticateUser, unfollowUser);

router.get("/followers", authenticateUser, getFollowers);

router.get("/following", authenticateUser, getFollowing);

export default router;