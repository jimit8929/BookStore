import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    rating: {
      type: Number,
      default: 4,
      min: 1,
      max: 5,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const BookModel = mongoose.model("book" , bookSchema);
export default BookModel;
