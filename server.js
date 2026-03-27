import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import router from "./routes/noteRoutes.js";
dotenv.config({path:"./.env"});
const app=express();
app.use(express.json());
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
