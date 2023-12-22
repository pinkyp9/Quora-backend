import express from "express";
const router = express.Router();
import multer from "multer";
import authenticateUser from "../middleware/authMiddleware.js";
import {Answerit,display,updateAnswer,deleteAnswer,upvoteAnswer,downvoteAnswer} from  "../controllers/answerControllers.js";
import { uploadCloudinary } from "../middleware/valid.js";


router.post('/uranswer',authenticateUser,uploadCloudinary.array('files', 5),Answerit)
router.get('/displayallanswer',authenticateUser,display)
router.patch('/updateanswer',authenticateUser,updateAnswer)
 router.delete('/deleteanswer',authenticateUser,deleteAnswer)
 router.patch('/upvoteanswer',authenticateUser,upvoteAnswer)
 router.patch('/downvoteanswer',authenticateUser,downvoteAnswer)

export default router;