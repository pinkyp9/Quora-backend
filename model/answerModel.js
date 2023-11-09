import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    upvotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', 
        },
      ],
      downvotes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ]});
    
const answer = mongoose.model('answers',answerSchema);

export default answer;