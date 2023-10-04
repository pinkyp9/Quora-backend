import express from "express";
const router = express.Router();
import * as sign  from "../controllers/userControllers.js";

router.post("/signup", sign.signUp);

export default router;