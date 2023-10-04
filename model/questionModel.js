import mongoose from "mongoose";


const questionSchema=new mongoose.Schema({
    questionT:{
        type : String,
        required : true,
    },
    category:{
        type : String,
        required : true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})


const question = mongoose.model('Question',questionSchema);

export default question;
