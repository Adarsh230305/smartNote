import Note from '../models/note.model.js';
import ApiError from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// create a new note
// const createNote=async(req,res)=>{
//    try {
//       const note=await Note.create(req.body)
//       res.status(201).json(note)
//    } catch (error) {
//      console.log("Error in creating a note :",error);
//      res.status(500).json({ message:error.message });
//    }
// }
const createNote=asyncHandler(async (req,res)=>{
    const note=await Note.create(req.body)
    if(!note){throw new ApiError(401,"Note not created")}
    else {
      res.status(200).json( new ApiResponse(200,note,"New note is created !"))
    }
})
// get all note
// const getAllNote=async(req,res)=>{
//       try {
//         const allNote=await Note.find()
//         res.status(201).json(allNote)
//       } catch (error) {
//         res.status(500).json({messege:"error in finding note"})
//       }
// }

const getAllNote=asyncHandler(async(req,res)=>{
    const AllNotes=await Note.find();
    if(!AllNotes){ throw new ApiError(401,"all note not found") }
    else {
        res.status(201).json(new ApiResponse(200,AllNotes,"Found all notes"))
         }
    
})
// get a single note
// const getSingleNote=async(req,res)=>{
//     try {
//         const singleNote=await Note.findById(req.params.id);
//         res.status(200).json(singleNote)
//     } catch (error) {
//         res.status(500).json({messege:"error in finding note"})
//     }
// }
const getSingleNote=asyncHandler(async(req,res)=>{
    const singleNote=await Note.findById(req.params.id);
    if(!singleNote){throw new ApiError(401,`${req.params.id} : not found`)}
    else {
        res.status(201).json(new ApiResponse(201,singleNote,`${req.params.id} found `))
    }
})
// const updateNote=async (req,res)=>{
//     try {
//         const updatedNotes=await Note.findByIdAndUpdate(
//             req.params.id, // id of the note to be updated params.id is used to get the id from the url
//             req.body, // data to be updated
//             {new:true}) // new:true is used to return the updated note instead of the old note
//         res.status(200).json(updatedNotes)
//     } catch (error) {
//         res.status(500).json({messege:"error in updating note"})
//     }
// }
const updateNote=asyncHandler(async(req,res)=>{
    const updatedNotes=await Note.findByIdAndUpdate(req.params.id,req.body);
    if(!updateNote){throw new ApiError(401,`${req.params.id} :Not updated`)}
    else {
        res.status(201).json(new ApiResponse(201,updatedNotes,`${req.params.id} updated succesfully ! `))
    }
})
// const deleteNote=async(req,res)=>{
//     try {
//         await Note.findByIdAndDelete(req.params.id)
//         res.status(200).json({messege:"note deleted successfully"})      
//     } catch (error) {
//         res.status(500).json({messege:"error in deleting note"})
//     }
// }
const deleteNote=asyncHandler(async(req,res)=>{
    const NoteTodelete=await Note.findById(req.params.id);
    if(!NoteTodelete){throw new ApiError(401,`${req.params.id} :Note not found`)}
    else {
       await Note.findByIdAndDelete(req.params.id)
        res.status(201).json({message:"Note deleted successfully !" })
    }
})
export {createNote,getAllNote,updateNote,getSingleNote,deleteNote};