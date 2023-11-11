import mongoose from "mongoose";

const questionCategories = ['Technology', 'Science', 'Arts', 'Business', 'Health', 'Other'];

const questionSchema=new mongoose.Schema({
    questionText:{
        type : String,
        required : true,
    },
    category:{
        type : String,
        enum: questionCategories, 
        required : true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    file: {
        type: String,
    },
},{
    timestamps:true,
})


const Question = mongoose.model('Question',questionSchema);

export default Question;
