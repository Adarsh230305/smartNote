import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
dotenv.config({path:"./.env"});
const app=express();
const port=process.env.PORT || 3000;
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is running at local host${port}`)
         app.on('error',(error)=>{
        console.log("DB_Connection failed");
        throw error })
    })
    
})
.catch((error)=>{
    console.log("Error in connecting to database:",error)
    throw error;
})
app.listen(port,()=>{
    console.log(`server is running at local host${port}`)
})