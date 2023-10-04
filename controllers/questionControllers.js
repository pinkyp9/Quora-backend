import question from '../model/questionModel.js';

const askQuestion = async (req, res) => {
    try {
        const Question = new question({
            questionT: req.body.questionT,
            category: req.body.category,
            user: req.body.user,
        });

        await Question.save();
        console.log("question saved successfully");
        res.send(Question);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

const printQuestions = async (req, res) => {
    try {
        const questions = await question.find();
        res.send(questions);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
};

export { askQuestion, printQuestions };
