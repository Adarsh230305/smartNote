import express from 'express';
import { createNote, deleteNote, getAllNote, getSingleNote, updateNote } from '../controllers/smartNote.js';
const router = express.Router();
router.route("/").post(createNote).get(getAllNote);
router.route("/:id").get(getSingleNote).put(updateNote).delete(deleteNote);
export default router;
