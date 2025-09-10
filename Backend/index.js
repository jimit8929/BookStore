import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

import userRoutes from "./routes/user.route.js";
import bookRoutes from "./routes/book.route.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/users", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
