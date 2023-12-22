import Answer from '../model/answerModel.js';
import dotenv from "dotenv";
import { mailing } from "../utilities/mail.js";
import { User } from '../model/userModel.js';
import { cloudinary } from '../middleware/cloudinary.js';
dotenv.config();

const mail = process.env.email;

const Answerit = async (req, res) => {
    try {
    const { content, questionId } = req.body;
    const userId = req.userId;
    const files = req.files;
    if(!content || !questionId){
      return res.status(401).json({error:"fill all the feilds"});
    }
    if(!files){
      const ans = new Answer({ content, question:questionId, user:userId });
      const userr = await User.find({userId});
      await ans.save();
      mailing(mail,userr.email,"answered", 'someone answered your question');
      console.log("answer saved successfully");
      return res.status(201).json(ans);}
  else{
    let uploadedFiles=[];
    const userr = await User.find({userId});
    uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.buffer, {
          folder: 'answer-uploads',
        });
        return { filename: result.original_filename, url: result.secure_url };
      })
    );
    const answer = new Answer({
      content,
      user: userId,
      question: questionId,
      files: uploadedFiles,
    });
    await answer.save();
    mailing(mail,userr.email,"answered", 'someone answered your question');
      console.log("answer saved successfully");
      return res.status(201).json(ans);
  }      
    } catch (err) {
        console.error(err);
        res.send(err);
    }
};

const display = async (req, res) => {
    try {
        const user = req.userId;
        const answers = await Answer.find({user:user});
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.json(error);
    }
};

const updateAnswer = async(req,res)=>{
    try{
        const{content , answerId } = req.body;
        const updateanswer = await Answer.findById(answerId);
        if(updateanswer.user == req.userId)
        {
            updateanswer.content = content;
            await updateanswer.save();
            res.status(201).json('update done');
        }
        else{
            res.status(500).json("you cannot update some else answers");
        }
    }
    catch(error){
        res.status(500).json(error);
    }

};

const deleteAnswer = async(req,res)=>{
    try{
        const {answerId}  = req.body;
        const d = await Answer.findById(answerId);
        if(!d)
        {res.json("answerid not found ")}
        else{
        if(d.user == req.userId){
        await Answer.findByIdAndDelete(answerId);
        res.status(201).json("answer deleted");}
        else{
            res.json('u cant delete some else answer');
        }

    }}
    catch(error){
        res.status(500).json(error);
    }
}


const upvoteAnswer = async (req, res) => {
    const { answerId } = req.body;
    const userId = req.userId;
    try {
      const upanswer = await Answer.findById(answerId);
      if (!upanswer) {
        return res.status(404).json({ message: 'Answer not found' });
      }
  
      const hasUpvoted = upanswer.upvotes.includes(userId);
      
      if (hasUpvoted) {
        upanswer.upvotes = upanswer.upvotes.filter(id => id.toString() !== userId);
      } else {
        upanswer.upvotes.push(userId);
        
        upanswer.downvotes = upanswer.downvotes.filter(id => id.toString() !== userId);
      }
      
      await upanswer.save();
      res.status(200).json(upanswer);
      console.log(`number of upvotes:${upanswer.upvotes.length}`);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  const downvoteAnswer = async (req, res) => {
    const { answerId } = req.body; 
    const userId = req.userId;
    try {
      const danswer = await Answer.findById(answerId);
  
      if (!danswer) {
        return res.status(404).json({ message: 'Answer not found' });
      }
  
      
      const hasDownvoted = danswer.downvotes.includes(userId);
      if (hasDownvoted) {
        danswer.downvotes = danswer.downvotes.filter(id => id.toString() !== userId);
      } else {
        danswer.downvotes.push(userId);
        danswer.upvotes = danswer.upvotes.filter(id => id.toString() !== userId);
      }
  
     await danswer.save();
      res.status(200).json(danswer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
    


export {Answerit,display,updateAnswer,deleteAnswer,upvoteAnswer,downvoteAnswer};
