import Question from '../model/questionModel.js';
import Answer from '../model/answerModel.js';
import { cloudinary } from '../middleware/cloudinary.js';
const askQuestion = async (req, res) => {
    try {   
      const userId = req.userId;
      const { questionText , category } = req.body;
      if(!questionText || !category){
        return res.status(400).json({error:'fill all the feilds'});
      }
      if (!req.file ) {
        const questionasked = new Question({ questionText, category, user: userId });
        await questionasked.save(); 
        return res.status(201).json(questionasked);
        //return res.status(400).json({ error: 'No file uploaded' });
      }
      else{
      const result = await cloudinary.uploader.upload(req.file.path);
      console.log(result);
      const questionasked = new Question({ questionText, category, user: userId ,file:result.secure_url});
      await questionasked.save(); 
      return res.status(201).json(questionasked);
      }
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create a question' });
    }
  };
  const updateQuestion = async (req, res) => {
    try {
      const { questionId, questionText,category } = req.body;
      const uquestion = await Question.findById(questionId);
      if (!uquestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      if(questionText)
      {uquestion.questionText = questionText;}
      if(category)
      {uquestion.category = category;}
      await uquestion.save();
      res.status(200).json(uquestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the question' });
    }
  };

  const deleteQuestion = async (req, res) => {
    try {
      const { questionId } = req.body;
      const dquestion = await Question.findById(questionId);
      if (!dquestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      await Question.findByIdAndDelete(questionId);
      res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete the question' });
    }
  };

const catQuestions = async (req, res) => {
    try {
        const category = req.body;
        if (!category) {
            return res.status(400).json({ error: 'Category parameter is missing' });
          }
          const finalq = [];
        const catquestions = await Question.find(category);
        catquestions.forEach((questions) => {
          finalq.push(questions);
      });
      res.status(201).json(finalq);
    } catch (error) {
        console.error(error);
        res.json("error");
    }
};

const allanswers = async (req, res) => {
    try {
      const {questionId} = req.body;
      const aquestion = await Answer.find({question:questionId});
       const finala=[];
      aquestion.forEach((answer)=>{
         finala.push(answer);
       });
       res.status(201).json(finala);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve all answers' });
    }
  };


export  {askQuestion,updateQuestion,deleteQuestion,catQuestions,allanswers};
