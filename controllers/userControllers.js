//apne mail se daalne wala baaki hai
import express from "express";
import {User,UserT} from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const mail = process.env.email;

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
  };

const sendOTP =  async (req, res)=>{
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });}

        else{
        
        const otp = generateOTP();
        
        const tUser = new UserT({ email, otp});
        await tUser.save();
               
        const testAccount = await nodemailer.createTestAccount();

    
        const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
        });

    const mailOption = {
        from: mail,
        to: email,
        subject: "Registration OTP",
        text: `Your OTP for registration is: ${otp}`,
      };

   
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.error("Email sending failed:", error);
        } else {
          console.log("Email sent:", info.response);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }


      });


      res.status(200).json({ message: "OTP sent for verification" });
        }}
     catch (error) {
        res.status(500).json({ message: error.message });}
}



 const register = async (req, res) => {
  try {
    const { username,password , email, otp } = req.body;

    const registrationData = await UserT.findOne({ email});
    if (!registrationData) {
      return res.status(400).json({ error: "Registration data not found" });
    };

    if (registrationData.otp == otp) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = new User({ username, email, password: hashedPassword, isVerified: true });
      await newUser.save();
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      try {

        const deletedUser = await UserT.findOneAndRemove(email);
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
      }
      const mailOptions = {
        from: mail,
        to: email,
        subject: "Registration Confirmation",
         text: "Thank you for registering with our platform!",
       };
       const info = await transporter.sendMail(mailOptions);
   
       console.log("Message sent: %s", info.messageId);
       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 
      res.status(200).json({ message: "Email verified, account activated" });
    } else {
      res.status(401).json({ error: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};



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



const updateUserProfile = async (req, res) => {
  try {
    const userId = req._id;
    const updates = req.body; 
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await User.findByIdAndUpdate(userId, updates, {
      new: false,
    });

    // if (!updatedUser) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const userId = req._id;

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


const followUser =  async (req, res) => {
  
  const { usernametofollow } = req.body;
  
  const userToFollow = await User.findOne({username: usernametofollow});
  if (!userToFollow) {
    res.status(404).json({message:"user not found"});
      }

  
  const currentUser =  await User.findById(req._id); 
  
  if (currentUser.following.includes(userToFollow.username)) {
    res.status(400).json({message:"You are already following this user."});
      }
  
  currentUser.following.push(userToFollow.username);
  
  userToFollow.followers.push(currentUser.username);

  await currentUser.save();
  await userToFollow.save();

  res.json({ message: "You are now following this user." });
};


const unfollowUser = async (req, res) => {
  const { usernametounfollow } = req.body;

  const userToUnfollow = await User.findOne({username:usernametounfollow});
  if (!userToUnfollow) {
    res.status(404);
    throw new Error("User not found");
  }

  const currentUser = await User.findById(req._id);

  if (!currentUser.following.includes(usernametounfollow)) {
    res.status(400).json({message:"You are not following this user."});
  }

  currentUser.following = currentUser.following.filter(
    (username) => username !== userToUnfollow.username
  );

  userToUnfollow.followers = userToUnfollow.followers.filter(
    (username) => username !== currentUser.username
  );


  await currentUser.save();
  await userToUnfollow.save();

  res.json({ message: "You have unfollowed this user." });
};


const getFollowers = async (req, res) => {
  const userId = req._id; 

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.followers);
};

const getFollowing = async (req, res) => {
  const userId = req._id; 

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.following);
};

export {followUser, unfollowUser, getFollowers, getFollowing , register, login ,getProfile,updateUserProfile,deleteUser,sendOTP};