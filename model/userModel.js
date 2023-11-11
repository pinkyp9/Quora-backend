import mongoose from "mongoose";
import validator from "email-validator";

const tempSchema = new mongoose.Schema({
email: {
  type: String,
  required: true,
  unique: true,
  validate: {
    validator: validator.validate, // Use email-validator's validate function
    message: "Invalid email address",
  },
},
otp :{
  type : Number,
  required: true
},
},{
  timestamps:true
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.validate, // Use email-validator's validate function
      message: "Invalid email address",
    },
  },
  followers: [
    {
      type: String,
      ref: "User",
    },
  ],
  following: [
    {
      type: String,
      ref: "User",
    },
  ],
  profilePicture:
    {type:String},
  role: {
      type: String,
      enum: ['admin', 'regular','premium'],
      default: 'regular',
    }
},{
  timestamps:true,
});

const User = mongoose.model("user", userSchema);
const UserT = mongoose.model("usertemporary",tempSchema);
export {User,UserT};
