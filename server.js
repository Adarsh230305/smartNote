import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./database/dbConnect.js";
import router from "./routes/noteRoutes.js";
import cookieParser from "cookie-parser";

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //It allows your server to read data coming from HTML forms and extended:true means it can read nested objects as well
app.use("/api/notes",router); // why this is used because we want to use the router for all the routes that start with /api/notes
const port=process.env.PORT || 3000;
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is running at local host :${port}`)
         app.on("error",(error)=>{
        console.log("DB_Connection failed",error);
         })
    })
})
.catch((error)=>{
    console.log("Error in connecting to database:",error)
})
