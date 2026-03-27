import mongoose from "mongoose";
const noteSchema=new mongoose.Schema({
   // id:{
   //  type:String,
   //  required:true
   // },
   title:{
    type:String,
    required:true
   },
   content:{
    type:String,
    required:true
   }
},{timeStamps:true})
const Note=mongoose.model("Note",noteSchema);
export default Note;