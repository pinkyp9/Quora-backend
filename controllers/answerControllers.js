import answer from '../model/answerModel.js';

const Answer = async (req, res) => {
    try {
        const ans = new answer({
            content: req.body.content,
            user: req.body.user,
            question: req.body.question
        });

        await ans.save();
        console.log("answer saved successfully");
        res.send(ans);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

const display = async (req, res) => {
    try {
        const answers = await answer.find();
        res.send(answers);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
};

export { Answer, display };
