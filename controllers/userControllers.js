//apne mail se daalne wala baaki hai
import express from "express";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// POST
const register =  async (req, res)=>{
    try {
        const { username, password, email } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });}

        else{
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        // const transporter = nodemailer.createTransport({
        //     service: "Gmail", // e.g., Gmail
        //     auth: {
        //       user: "thepinkypamecha@gmail.com",
        //       pass: "pinkynathu",
        //     },
        //   });

        //   const mailOptions = {
        //     from: "your-email@gmail.com",
        //     to: email,
        //     subject: "Registration Confirmation",
        //     text: "Thank you for registering with our platform!",
        //   };
      
        //   transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //       console.error("Email sending failed:", error);
        //     } else {
        //       console.log("Email sent:", info.response);
        //     }
        //   });
        const testAccount = await nodemailer.createTestAccount();

    // Create a transporter using the Ethereal SMTP credentials
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const mailOptions = {
        from: "thepinkypamecha@gmail.com",
        to: email,
        subject: "Registration Confirmation",
        text: "Thank you for registering with our platform!",
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


        res.status(201).json({ message: "User registered successfully." });}

        }
     catch (error) {
        res.status(500).json({ message: error.message });}
}

const login = async (req,res)=>{
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', 
        });

        res.status(200).json({ message: 'Login successful.', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const getProfile = async(req,res)=>{
    try{
            console.log(req._id);
            const user = await User.findById(req._id);
            res.status(200).json({message: 'Authenticated route', userId: req._id, user});

        }
    catch(error){
        console.log(error);
        res.status(500).json({message:"error"})
    }
}

// const updatemail = async(req,res)=>{
//     try {
//         const { newEmail } = req.body;
//         const userId = req._id;
//         console.log(userId);
    
       
//             const user = await User.findById(userId);
    
//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }
    

//             user.email = newEmail;
//             await user.save();
    
//             res.status(200).json({ message: 'Email updated successfully' });
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({message:"error"})
//     }
// }
 

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body; // New user profile data

    // Hash the password before updating (if provided in updates)
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  try {
    const userId = req._id;

    // Find and remove the user by ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export { register, login ,getProfile,updateUserProfile,deleteUser};