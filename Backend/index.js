import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

import userRoutes from "./routes/user.route.js";

const app = express();

const PORT = process.env.PORT || 4000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api/users" , userRoutes);




app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, (req, res) => {
  connectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
