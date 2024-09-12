import Habit from "../models/habit.model.js";

const createHabit = async (req, res) => {
  try {
    const { name, description, frequency } = req.body;
    const newHabit = new Habit({
      name,
      description,
      frequency,
      user: req.user._id,
    });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getHabits = async (req, res) => {
  try {
    const habit = await Habit.find({ user: req.user._id });
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      user: req.user._id,
      _id: req.params.id,
    });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    const now = new Date();
    const lastCompleted = habit.lastCompleted || now;
    const isOnTime = checkIfOnTime(habit.frequency, lastCompleted, now);
    if (isOnTime) {
      habit.streak += 1;
      habit.points += calculatePoints(habit.streak, habit.frequency);
    } else {
      habit.streak = 1;
      habit.points += calculatePoints(habit.streak, habit.frequency);
    }
    habit.lastCompleted = now;
    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const checkIfOnTime = (frequency, lastCompleted, now) => {
  switch (frequency) {
    case "daily":
      return now - lastCompleted < 24 * 60 * 60 * 1000; // 24 hours
    case "weekly":
      return now - lastCompleted < 7 * 24 * 60 * 60 * 1000; // 7 days
    case "monthly":
      return now.getMonth() === lastCompleted.getMonth();
    default:
      return false;
  }
};
const calculatePoints = (streak, frequency) => {
  let basePoints;
  switch (frequency) {
    case "daily":
      basePoints = 10;
      break;
    case "weekly":
      basePoints = 50;
      break;
    case "monthly":
      basePoints = 200;
      break;
  }
  return basePoints * streak;
};

export { createHabit, getHabits, updateHabit };
