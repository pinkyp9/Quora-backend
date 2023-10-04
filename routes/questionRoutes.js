import express from "express";
const router = express.Router();
import {askQuestion,printQuestions} from  "../controllers/questionControllers.js";


router.post('/askQuestion',askQuestion)
router.get('/getQuestions',printQuestions)


export default router;