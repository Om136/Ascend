import express from "express";
import {
  createHabit,
  updateHabit,
  getHabits,
  getHabitById,
  addNote,
  getCategories,
  updateHabitDetails,
} from "../controllers/habit.controller.js";
import authMiddleware from "../middelwares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createHabit);
router.post("/:id/complete", authMiddleware, updateHabit);
router.post("/:id/notes", authMiddleware, addNote);
router.get("/", authMiddleware, getHabits);
router.get("/categories", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getHabitById);
router.patch("/:id", authMiddleware, updateHabitDetails);

export default router;
