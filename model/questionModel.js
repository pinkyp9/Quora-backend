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
    answers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Answer', 
        },
      ],
    
},{
    timestamps:true,
})


const question = mongoose.model('Question',questionSchema);

export default question;
