import express from "express";
import {
  createNote,
  deleteNote,
  getAllNote,
  getSingleNote,
  updateNote,
} from "../controllers/smartNote.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();
router
  .route("/")
  .post(verifyJWT, createNote)
  .get(verifyJWT, getAllNote);

router
  .route("/:id")
  .get(verifyJWT, getSingleNote)
  .put(verifyJWT, updateNote)
  .delete(verifyJWT, deleteNote);
export default router;