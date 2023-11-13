import {User,UserT} from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { mailing } from "../utilities/mail.js";

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
               
        mailing(mail,email,"Registration OTP", `Your OTP for registration is: ${otp}`);

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
      mailing(mail,email,"Registration Confirmation", "Thank you for registering with our platform!")

      try {

        await UserT.findOneAndDelete(email);
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
      }
 
      res.status(200).json({ message: "Email verified, account activated" });
    } else {
      res.status(401).json({ error: "OTP verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "registratoion failed" });
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

const getmyProfile = async(req,res)=>{
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

const getProfile = async(req,res)=>{
  try{
          const {userId} = req.body;
          const user = await User.findById(userId);
          res.status(200).json({message: 'Authenticated route', userId, user});

      }
  catch(error){
      console.log(error);
      res.status(500).json({message:"error"})
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
     }
    const {password,email} = req.body; 
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if(email)
    {user.email = email;}
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req._id;

    const deletedUser = await User.findByIdAndDelete(userId);

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
  try{
  
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
}catch(error){
  res.send(400).json(error);
}};

const unfollowUser = async (req, res) => {
  try{
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
}catch(error)
{res.status(500).json({ message: error.message });}};

const getFollowers = async (req, res) => {
  try{
  const userId = req._id; 

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.followers);
}catch(error){
  res.status(500).json({ message: error.message });
}};

const getFollowing = async (req, res) => {
  try{
  const userId = req._id; 

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.following);
}catch(error){
  res.status(500).json({ message: error.message });
}};

const uploadProfilePicture =  async(req,res) =>{
  try {
    const user = await User.findById(req._id); 
  

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.file) {
      user.profilePicture = req.file.path;
      await user.save();
      return res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } else {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {followUser, unfollowUser, getFollowers, getFollowing , register, login ,getProfile,getmyProfile,updateUserProfile,deleteUser,sendOTP,uploadProfilePicture};