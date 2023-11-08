import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import morgan from "morgan";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI;
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("uploads",express.static('uploads'));
mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to mongoose");
        app.listen(port, () => {
            console.log(`Port is running at ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/user", userRoutes);
app.use("/answer", answerRoutes);
app.use("/question", questionRoutes);


app.get("/",(req,res)=>{
    res.send("Welcome to your Q&A platform!");
});

app.use((err,req,res,net) => {
    console.error(err.stack);
    res.status(500).send("something went wrong!");
})