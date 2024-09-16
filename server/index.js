import express from "express";
import authRoutes from "./routes/auth.route.js";
import habitRoutes from "./routes/habit.route.js";
import dotenv from "dotenv";
import connect from "./db/connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

app.listen(8000, () => {
  console.log("Server is running on port 8000");
  connect();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
