import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/authMiddleware.js";
import {Answerit,display,updateAnswer,deleteAnswer,upvoteAnswer,downvoteAnswer} from  "../controllers/answerControllers.js";


router.post('/uranswer',authenticateUser,Answerit)
router.get('/displayallanswer',authenticateUser,display)
router.patch('/updateanswer',authenticateUser,updateAnswer)
 router.delete('/deleteanswer',authenticateUser,deleteAnswer)
 router.patch('/upvoteanswer',authenticateUser,upvoteAnswer)
 router.patch('/downvoteanswer',authenticateUser,downvoteAnswer)

export default router;