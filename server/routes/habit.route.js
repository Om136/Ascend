import express from "express";
import { createHabit, completeHabit, getHabits } from "../controllers/habit.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = express.Router();

router.post("/", authMiddleware, createHabit);
router.post("/:id/complete", authMiddleware, completeHabit);
router.get("/", authMiddleware, getHabits);
