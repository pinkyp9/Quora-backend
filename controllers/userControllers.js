import express from "express";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// POST: /signup
const signUp =  async (req, res)=>{
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
        
            const { username, password,email } = req.body;
            const user = await User.findOne({ username });
            res.status(200).json({message: 'Authenticated route', userId: req._id, user});

        }
    catch(error){
        console.log(error);
        res.status(500).json({message:"error"})
    }
}

const updatemail = async(req,res)=>{
    try {
        const { newEmail } = req.body;
        const userId = req._id;
    
       
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    

            user.email = newEmail;
            await user.save();
    
            res.status(200).json({ message: 'Email updated successfully' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"error"})
    }
}

export { signUp, login ,getProfile,updatemail};