import express from 'express';
import { createNote, deleteNote, getAllNote, getSingleNote, updateNote } from '../controllers/smartNote.js';
import { loginUser, logOutUser, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();
router.route("/").post(createNote).get(getAllNote);
router.route("/:id").get(getSingleNote).put(updateNote).delete(deleteNote);
router.route("/register").post(upload.fields([{
    name:"avatar",
    maxCount:1
}]),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logOutUser)
export default router;
