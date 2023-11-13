import express from "express";
import authenticateUser from "../middleware/authMiddleware.js";
const router = express.Router();
import {askQuestion,updateQuestion,deleteQuestion,catQuestions,allanswers} from  "../controllers/questionControllers.js";
import { uploadCloudinary } from "../middleware/valid.js";

router.post('/askQuestion',authenticateUser,uploadCloudinary.single('file'),askQuestion);
router.put('/updateQuestion',authenticateUser,updateQuestion);
router.delete('/deleteQuestion',authenticateUser,deleteQuestion);
router.get('/getcategoryquestions',catQuestions);
router.get('/getallanswers',allanswers);



export default router;