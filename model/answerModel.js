import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to a User model (if you have one)
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question", // Reference to a Question model
        required: true,
    }});
    
const answer = mongoose.model('answers',answerSchema);

export default answer;