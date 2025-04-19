import Habit from "../models/habit.model.js";
import User from "../models/user.model.js";

// Get all available categories
const getCategories = async (req, res) => {
  try {
    const categories = Habit.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Failed to fetch categories",
      details: error.message,
    });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, frequency, category } = req.body;

    // Validate required fields
    const missingFields = {
      name: !name ? "Habit name is required" : null,
      frequency: !frequency ? "Frequency is required" : null,
    };

    if (Object.values(missingFields).some((v) => v)) {
      return res.status(400).json({
        message: "Missing required fields",
        details: missingFields,
      });
    }

    // Validate frequency
    if (!["Daily", "Weekly", "Monthly"].includes(frequency)) {
      return res.status(400).json({
        message: "Invalid frequency value",
        details: "Frequency must be Daily, Weekly, or Monthly",
      });
    }

    // Check if category is valid
    if (category && !Habit.getCategories().includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
        details: "The provided category is not valid",
      });
    }

    const existingHabit = await Habit.findOne({
      user: req.user._id,
      name: name,
    });

    if (existingHabit) {
      return res.status(400).json({
        message: "Duplicate habit",
        details: "A habit with this name already exists",
      });
    }

    const newHabit = new Habit({
      name,
      frequency,
      category: category || "Other",
      user: req.user._id,
    });

    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    console.error("Error creating habit:", error);
    res.status(500).json({
      message: "Failed to create habit",
      details: error.message,
    });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const user = await User.findById(req.user._id);

    // Update completion status for each habit based on current period
    const now = new Date();
    habits.forEach((habit) => {
      const currentPeriod = habit.getCurrentPeriod(now);
      habit.completed = habit.lastCompletedPeriod === currentPeriod;
    });

    res.status(200).json({
      habits,
      user: {
        level: user.level,
        levelTitle: user.getLevelTitle(),
        totalPoints: user.totalPoints,
        achievements: user.achievements,
      },
    });
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({
      message: "Failed to fetch habits",
      details: error.message,
    });
  }
};

const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
        details:
          "The requested habit does not exist or you don't have access to it",
      });
    }

    res.status(200).json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    res.status(500).json({
      message: "Failed to fetch habit",
      details: error.message,
    });
  }
};

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      user: req.user._id,
      _id: req.params.id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
        details:
          "The requested habit does not exist or you don't have access to it",
      });
    }

    // Check if habit can be completed in current period
    if (!habit.canComplete()) {
      return res.status(400).json({
        message: "Already completed",
        details: `This ${habit.frequency.toLowerCase()} habit has already been completed for the current period`,
      });
    }

    const now = new Date();
    const currentPeriod = habit.getCurrentPeriod(now);
    const lastCompleted = habit.lastCompleted || now;
    const isOnTime = checkIfOnTime(habit.frequency, lastCompleted, now);

    if (isOnTime) {
      habit.streak += 1;
      habit.points += calculatePoints(habit.streak, habit.frequency);
    } else {
      habit.streak = 1;
      habit.points += calculatePoints(1, habit.frequency);
    }

    habit.lastCompleted = now;
    habit.lastCompletedPeriod = currentPeriod;
    habit.completed = true;

    // Update user's total points and check achievements
    const user = await User.findById(req.user._id);
    user.totalPoints += habit.points;
    user.level = user.calculateLevel();

    // Check for streak achievements
    await user.checkAchievements("streak", habit.streak);
    // Check for points achievements
    await user.checkAchievements("points", user.totalPoints);
    // Check for habits completed achievement
    await user.checkAchievements("habits", 1);

    await Promise.all([habit.save(), user.save()]);

    // Return updated habit and user info
    res.status(200).json({
      habit,
      user: {
        level: user.level,
        levelTitle: user.getLevelTitle(),
        totalPoints: user.totalPoints,
        achievements: user.achievements,
      },
    });
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).json({
      message: "Failed to update habit",
      details: error.message,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        message: "Missing required fields",
        details: "Note content is required",
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
        details:
          "The requested habit does not exist or you don't have access to it",
      });
    }

    habit.notes.push({ content });
    await habit.save();

    res.status(200).json(habit);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({
      message: "Failed to add note",
      details: error.message,
    });
  }
};

const updateHabitDetails = async (req, res) => {
  try {
    const { category } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
        details:
          "The requested habit does not exist or you don't have access to it",
      });
    }

    // Validate category if provided
    if (category) {
      if (!Habit.getCategories().includes(category)) {
        return res.status(400).json({
          message: "Invalid category",
          details: "The provided category is not valid",
        });
      }
      habit.category = category;
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).json({
      message: "Failed to update habit",
      details: error.message,
    });
  }
};

const checkIfOnTime = (frequency, lastCompleted, now) => {
  switch (frequency) {
    case "Daily":
      return now - lastCompleted < 24 * 60 * 60 * 1000; // 24 hours
    case "Weekly":
      return now - lastCompleted < 7 * 24 * 60 * 60 * 1000; // 7 days
    case "Monthly":
      return now.getMonth() === lastCompleted.getMonth();
    default:
      return false;
  }
};

const calculatePoints = (streak, frequency) => {
  let basePoints;
  switch (frequency) {
    case "Daily":
      basePoints = 10;
      break;
    case "Weekly":
      basePoints = 50;
      break;
    case "Monthly":
      basePoints = 200;
      break;
  }
  return basePoints;
};

export {
  createHabit,
  getHabits,
  updateHabit,
  getHabitById,
  addNote,
  getCategories,
  updateHabitDetails,
};
