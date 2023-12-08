import express from "express";
import {followUser,getmyProfile,changeRole,uploadProfilePicture,unfollowUser,getFollowers,getFollowing,register,login,getProfile,updateUserProfile,deleteUser,sendOTP}  from "../controllers/userControllers.js";
import authenticateUser from "../middleware/authMiddleware.js";
import authorizePremium from "../middleware/premiumUsers.js";
import {upload} from "../middleware/valid.js";

const router = express.Router();

router.put("/changerole",authenticateUser,changeRole);

router.post("/sendotp", sendOTP); 

router.post("/register", register);

router.post("/login",login);

router.get('/myprofile', authenticateUser,getmyProfile);

router.get('/profile', authenticateUser,getProfile);

router.put('/update', authenticateUser,updateUserProfile);

router.delete("/delete", authenticateUser, deleteUser);

router.post("/follow", authenticateUser, followUser);

router.post("/unfollow", authenticateUser, unfollowUser);

router.get("/followers", authenticateUser, getFollowers);

router.get("/following", authenticateUser, getFollowing);

router.post('/upload-profile-picture', authenticateUser,authorizePremium,upload.single('profilePicture'),uploadProfilePicture);

export default router;