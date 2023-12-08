import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import morgan from "morgan";
import cors from "cors";
import connectDb from "./config/dbConnection.js"
dotenv.config();

connectDb();

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("uploads",express.static('uploads'));
app.use(cors());
app.use(morgan("combined"));

app.use("/user", userRoutes);
app.use("/answer", answerRoutes);
app.use("/question", questionRoutes);

app.use((err,req,res,next) => {
    console.error({stackTrace:err.stack,message:err.message});
    res.status(500).send("something went wrong!");
})

app.get("/",(req,res)=>{
    res.send("Welcome to your Q&A platform!");
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});