import express from "express";
import {
  createHabit,
  updateHabit,
  getHabits,
} from "../controllers/habit.controller.js";
import authMiddleware from "../middelwares/auth.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, createHabit);
router.post("/:id/complete", authMiddleware, updateHabit);
router.get("/", authMiddleware, getHabits);

export default router;
