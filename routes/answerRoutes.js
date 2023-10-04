import express from "express";
const router = express.Router();
import {Answer,display} from  "../controllers/answerControllers.js";

router.post('/uanswer',Answer)
router.get('/display',display)


export default router;