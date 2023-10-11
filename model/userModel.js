import mongoose from "mongoose";
import validator from "email-validator";
import bcrypt from 'bcrypt';


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
});

const User = mongoose.model("user", userSchema);

export default User;
