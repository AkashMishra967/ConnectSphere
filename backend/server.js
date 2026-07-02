import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(postRoutes);
app.use(userRoutes);



const start = async () =>{
    const connectDB = await mongoose.connect("mongodb://akashmishra967033_db_user:Akash9670@ac-wob4lkq-shard-00-00.zn51gil.mongodb.net:27017,ac-wob4lkq-shard-00-01.zn51gil.mongodb.net:27017,ac-wob4lkq-shard-00-02.zn51gil.mongodb.net:27017/?ssl=true&replicaSet=atlas-1ayiyg-shard-0&authSource=admin&appName=Cluster0");
    app.listen(9090,() =>{
        console.log("server is running on port 9090");
    })
}
start();