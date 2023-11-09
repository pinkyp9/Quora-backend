import question from '../model/questionModel.js';

const askQuestion = async (req, res) => {
    try {
        const userId = req._id;
      const { questionText , category } = req.body;
      const questionasked = new question({ questionText, category, user: userId });
      await questionasked.save();

      res.status(201).json(questionasked);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create a question' });
    }
  };
  const updateQuestion = async (req, res) => {
    try {
      const { questionId, questionText,category } = req.body;
      const uquestion = await question.findById(questionId);
      if (!uquestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      if(questionText)
      {uquestion.questionText = questionText;}
      if(category)
      {uquestion.category = category;}
      await uquestion.save();
      res.json(uquestion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update the question' });
    }
  };

  const deleteQuestion = async (req, res) => {
    try {
      const { questionId } = req.body;
      const dquestion = await question.findById(questionId);
      if (!dquestion) {
        return res.status(404).json({ error: 'Question not found' });
      }
      await question.findByIdAndDelete(questionId);
      res.json({ message: 'Question deleted' });
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
        const catquestions = await question.find(category);
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
      const questionId = req.body;
      const aquestion = await question.findById(questionId);
      res.json(aquestion.answers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve all answers' });
    }
  };


export  {askQuestion,updateQuestion,deleteQuestion,catQuestions,allanswers};
