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
    const {
      name,
      description,
      frequency,
      category,
      reminderEnabled,
      reminderTime,
      reminderDays,
    } = req.body;

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
      description: description || "",
      frequency,
      category: category || "Other",
      reminderEnabled: reminderEnabled || false,
      reminderTime: reminderTime || "09:00",
      reminderDays: reminderDays || [1, 2, 3, 4, 5, 6, 0],
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

    // Get next level information
    const nextLevelInfo = user.getNextLevelInfo();

    res.status(200).json({
      habits,
      user: {
        level: user.calculateLevel(),
        levelTitle: user.getLevelTitle(),
        totalPoints: user.totalPoints,
        achievements: user.achievements,
        nextLevelInfo: nextLevelInfo,
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

const updateHabitReminder = async (req, res) => {
  try {
    const { reminderEnabled, reminderTime, reminderDays } = req.body;

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

    // Update reminder settings
    if (reminderEnabled !== undefined) habit.reminderEnabled = reminderEnabled;
    if (reminderTime) habit.reminderTime = reminderTime;
    if (reminderDays) habit.reminderDays = reminderDays;

    await habit.save();

    res.status(200).json({
      message: "Reminder settings updated successfully",
      habit,
    });
  } catch (error) {
    console.error("Error updating habit reminder:", error);
    res.status(500).json({
      message: "Failed to update habit reminder",
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
    habit.completionHistory = habit.completionHistory || [];
    habit.completionHistory.push({ completedAt: now });

    // Update user's total points and check achievements
    const user = await User.findById(req.user._id);
    user.totalPoints += habit.points;
    user.level = user.calculateLevel();

    // Get stats for comprehensive achievement checks
    const userHabits = await Habit.find({ user: req.user._id });
    const completedHabits = userHabits.filter(
      (h) => (h.completionHistory?.length || 0) > 0
    ).length;
    const habitCategories = [...new Set(userHabits.map((h) => h.category))];
    const categoryCompletions = {};

    // Count completions per category
    userHabits.forEach((h) => {
      const completionCount = h.completionHistory?.length || 0;
      if (completionCount > 0) {
        categoryCompletions[h.category] =
          (categoryCompletions[h.category] || 0) + completionCount;
      }
    });

    // Check all types of achievements
    const habitAchievements = await user.checkAchievements(
      "habits",
      completedHabits
    );
    const pointAchievements = await user.checkAchievements(
      "points",
      user.totalPoints
    );
    const streakAchievements = await user.checkAchievements(
      "streak",
      habit.streak
    );
    const varietyAchievements = await user.checkAchievements(
      "variety",
      habitCategories.length
    );
    const activeHabitsAchievements = await user.checkAchievements(
      "active_habits",
      userHabits.length,
      null,
      userHabits.length
    );

    // Check category achievements
    let categoryAchievements = [];
    for (const [category, count] of Object.entries(categoryCompletions)) {
      const catAchievements = await user.checkAchievements(
        "category",
        count,
        category
      );
      categoryAchievements = [...categoryAchievements, ...catAchievements];
    }

    // Check for daily habits achievement
    const dailyHabits = userHabits.filter(
      (h) => h.frequency === "Daily"
    ).length;
    const dailyAchievements =
      dailyHabits > 0
        ? await user.checkAchievements("daily_habits", dailyHabits)
        : [];

    // Combine all new achievements for response
    const allNewAchievements = [
      ...habitAchievements,
      ...pointAchievements,
      ...streakAchievements,
      ...varietyAchievements,
      ...activeHabitsAchievements,
      ...categoryAchievements,
      ...dailyAchievements,
    ];

    await Promise.all([habit.save(), user.save()]);

    // Get next level information
    const nextLevelInfo = user.getNextLevelInfo();

    // Return updated habit and user info with new achievements
    res.status(200).json({
      habit,
      user: {
        level: user.calculateLevel(),
        levelTitle: user.getLevelTitle(),
        totalPoints: user.totalPoints,
        achievements: user.achievements,
        nextLevelInfo: nextLevelInfo,
      },
      newAchievements: allNewAchievements,
      achievementCount: allNewAchievements.length,
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
    const content = req.body?.content ?? req.body?.notes;
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
    default:
      basePoints = 10;
  }

  // Streak bonus system - exponential rewards for consistency
  let streakMultiplier = 1;
  if (streak >= 3) streakMultiplier = 1.2; // 20% bonus after 3 days
  if (streak >= 7) streakMultiplier = 1.5; // 50% bonus after 1 week
  if (streak >= 14) streakMultiplier = 1.8; // 80% bonus after 2 weeks
  if (streak >= 30) streakMultiplier = 2.2; // 120% bonus after 1 month
  if (streak >= 60) streakMultiplier = 2.8; // 180% bonus after 2 months
  if (streak >= 100) streakMultiplier = 3.5; // 250% bonus after 100 days!
  if (streak >= 365) streakMultiplier = 5.0; // 400% bonus for a full year!

  // Special milestone bonuses
  let milestoneBonus = 0;
  if (streak === 7) milestoneBonus = 50; // Week milestone
  if (streak === 30) milestoneBonus = 200; // Month milestone
  if (streak === 60) milestoneBonus = 500; // 2-month milestone
  if (streak === 100) milestoneBonus = 1000; // 100-day milestone
  if (streak === 365) milestoneBonus = 5000; // Year milestone

  return Math.floor(basePoints * streakMultiplier) + milestoneBonus;
};

export {
  createHabit,
  getHabits,
  updateHabit,
  updateHabitReminder,
  getHabitById,
  addNote,
  getCategories,
  updateHabitDetails,
};
