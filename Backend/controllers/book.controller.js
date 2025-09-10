import BookModel from "../models/book.model.js";
import path from "path";
import fs from "fs";

//Create Book
export const createBook = async (req, res, next) => {
  try {
    const filename = req.file?.filename ?? null;
    const imagePath = filename ? `/uploads/${filename}` : null;
    const { title, author, price, rating, category, description } = req.body;

    const book = new BookModel({
      title,
      author,
      price,
      rating,
      category,
      description,
      image: imagePath,
    });

    const saved = await book.save();

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

//Get Book
export const getBooks = async (req, res, next) => {
  try {
    const books = await BookModel.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

//Delete Book
export const deleteBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    //image Handling
    if (book.image) {
      const filepath = path.join(process.cwd(), book.image);
      fs.unlink(filepath, (err) => {
        if (err) console.warn("Failed to Delete the image file", err);
      });
    }

    res.json({ message: "Book Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};
