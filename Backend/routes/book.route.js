import express from "express";
import multer from "multer";
import {
  createBook,
  deleteBook,
  getBooks,
} from "../controllers/book.controller.js";

const router = express.Router();

//Multer Setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });



//Routes

router.post("/", upload.single("image"), createBook);
router.get("/", getBooks);
router.delete("/:id", deleteBook);

export default router;
