import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "streak",
      "points",
      "habits",
      "category",
      "variety",
      "daily_habits",
      "active_habits",
      "perfect_week",
      "early_completion",
      "late_completion",
    ],
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: null,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      default: 1,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    achievements: [achievementSchema],
  },
  { timestamps: true }
);

userSchema.methods.calculateLevel = function () {
  // Progressive level system - each level requires more points
  const pointsThresholds = [
    0, // Level 1
    100, // Level 2
    300, // Level 3
    600, // Level 4
    1000, // Level 5
    1500, // Level 6
    2200, // Level 7
    3000, // Level 8
    4000, // Level 9
    5200, // Level 10
    6600, // Level 11
    8200, // Level 12
    10000, // Level 13
    12000, // Level 14
    14500, // Level 15
    17500, // Level 16
    21000, // Level 17
    25000, // Level 18
    30000, // Level 19
    50000, // Level 20 (Master)
  ];

  let level = 1;
  for (let i = pointsThresholds.length - 1; i >= 0; i--) {
    if (this.totalPoints >= pointsThresholds[i]) {
      level = i + 1;
      break;
    }
  }

  return Math.min(level, 20); // Cap at level 20
};

// Get next level requirements
userSchema.methods.getNextLevelInfo = function () {
  const pointsThresholds = [
    0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200, 10000,
    12000, 14500, 17500, 21000, 25000, 30000, 50000,
  ];

  const currentLevel = this.calculateLevel();
  if (currentLevel >= 20) {
    return { nextLevelPoints: null, pointsNeeded: 0, progress: 100 };
  }

  const nextLevelPoints = pointsThresholds[currentLevel];
  const currentLevelPoints = pointsThresholds[currentLevel - 1];
  const pointsNeeded = nextLevelPoints - this.totalPoints;
  const progress = Math.floor(
    ((this.totalPoints - currentLevelPoints) /
      (nextLevelPoints - currentLevelPoints)) *
      100
  );

  return { nextLevelPoints, pointsNeeded, progress };
};

// Get level title based on level number
userSchema.methods.getLevelTitle = function () {
  const titles = {
    1: "Seedling",
    2: "Sprout",
    3: "Sapling",
    4: "Growing Tree",
    5: "Strong Oak",
    6: "Wise Elder",
    7: "Forest Guardian",
    8: "Nature's Champion",
    9: "Habit Sage",
    10: "Life Architect",
    11: "Transformation Master",
    12: "Discipline Warrior",
    13: "Consistency King",
    14: "Habit Virtuoso",
    15: "Excellence Embodied",
    16: "Peak Performer",
    17: "Legendary Achiever",
    18: "Transcendent Being",
    19: "Habit Deity",
    20: "Enlightened Master",
  };
  return titles[this.level] || "Unknown";
};

// Check and award achievements
userSchema.methods.checkAchievements = async function (
  type,
  value,
  category = null,
  totalHabits = 0
) {
  const achievements = [
    // ===== FIRST STEPS =====
    {
      name: "First Steps",
      description: "Complete your first habit",
      type: "habits",
      threshold: 1,
      icon: "🎯",
      rarity: "common",
    },
    {
      name: "Getting Started",
      description: "Complete 5 habits",
      type: "habits",
      threshold: 5,
      icon: "🌱",
      rarity: "common",
    },
    {
      name: "Momentum Builder",
      description: "Complete 25 habits",
      type: "habits",
      threshold: 25,
      icon: "⚡",
      rarity: "uncommon",
    },
    {
      name: "Habit Machine",
      description: "Complete 100 habits",
      type: "habits",
      threshold: 100,
      icon: "🔧",
      rarity: "rare",
    },
    {
      name: "Completion Master",
      description: "Complete 500 habits",
      type: "habits",
      threshold: 500,
      icon: "👑",
      rarity: "epic",
    },

    // ===== STREAK ACHIEVEMENTS =====
    {
      name: "Hot Start",
      description: "Maintain a 3-day streak",
      type: "streak",
      threshold: 3,
      icon: "🔥",
      rarity: "common",
    },
    {
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      type: "streak",
      threshold: 7,
      icon: "⚔️",
      rarity: "common",
    },
    {
      name: "Fortnight Fighter",
      description: "Maintain a 14-day streak",
      type: "streak",
      threshold: 14,
      icon: "�️",
      rarity: "uncommon",
    },
    {
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      type: "streak",
      threshold: 30,
      icon: "⭐",
      rarity: "uncommon",
    },
    {
      name: "Two Month Titan",
      description: "Maintain a 60-day streak",
      type: "streak",
      threshold: 60,
      icon: "💪",
      rarity: "rare",
    },
    {
      name: "Century Club",
      description: "Maintain a 100-day streak",
      type: "streak",
      threshold: 100,
      icon: "💯",
      rarity: "rare",
    },
    {
      name: "Seasonal Sage",
      description: "Maintain a 90-day streak",
      type: "streak",
      threshold: 90,
      icon: "🍂",
      rarity: "rare",
    },
    {
      name: "Half Year Hero",
      description: "Maintain a 180-day streak",
      type: "streak",
      threshold: 180,
      icon: "🎯",
      rarity: "epic",
    },
    {
      name: "Year-Long Legend",
      description: "Maintain a 365-day streak",
      type: "streak",
      threshold: 365,
      icon: "🏆",
      rarity: "legendary",
    },

    // ===== POINTS ACHIEVEMENTS =====
    {
      name: "Point Starter",
      description: "Earn 50 points",
      type: "points",
      threshold: 50,
      icon: "🪙",
      rarity: "common",
    },
    {
      name: "Point Collector",
      description: "Earn 200 points",
      type: "points",
      threshold: 200,
      icon: "💰",
      rarity: "common",
    },
    {
      name: "Point Accumulator",
      description: "Earn 500 points",
      type: "points",
      threshold: 500,
      icon: "�",
      rarity: "uncommon",
    },
    {
      name: "Point Master",
      description: "Earn 1,000 points",
      type: "points",
      threshold: 1000,
      icon: "🏆",
      rarity: "uncommon",
    },
    {
      name: "Point Virtuoso",
      description: "Earn 2,500 points",
      type: "points",
      threshold: 2500,
      icon: "🎖️",
      rarity: "rare",
    },
    {
      name: "Point Emperor",
      description: "Earn 5,000 points",
      type: "points",
      threshold: 5000,
      icon: "👑",
      rarity: "rare",
    },
    {
      name: "Point Deity",
      description: "Earn 10,000 points",
      type: "points",
      threshold: 10000,
      icon: "⚡",
      rarity: "epic",
    },
    {
      name: "Point Transcendent",
      description: "Earn 25,000 points",
      type: "points",
      threshold: 25000,
      icon: "🌟",
      rarity: "legendary",
    },

    // ===== CATEGORY ACHIEVEMENTS =====
    {
      name: "Health Enthusiast",
      description: "Complete 10 Health habits",
      type: "category",
      category: "Health",
      threshold: 10,
      icon: "❤️",
      rarity: "uncommon",
    },
    {
      name: "Fitness Fanatic",
      description: "Complete 15 Fitness habits",
      type: "category",
      category: "Fitness",
      threshold: 15,
      icon: "💪",
      rarity: "uncommon",
    },
    {
      name: "Learning Lover",
      description: "Complete 20 Learning habits",
      type: "category",
      category: "Learning",
      threshold: 20,
      icon: "📚",
      rarity: "uncommon",
    },
    {
      name: "Work Warrior",
      description: "Complete 25 Work habits",
      type: "category",
      category: "Work",
      threshold: 25,
      icon: "💼",
      rarity: "rare",
    },
    {
      name: "Productivity Pro",
      description: "Complete 20 Productivity habits",
      type: "category",
      category: "Productivity",
      threshold: 20,
      icon: "⚡",
      rarity: "rare",
    },

    // ===== VARIETY ACHIEVEMENTS =====
    {
      name: "Well-Rounded",
      description: "Complete habits in 3 different categories",
      type: "variety",
      threshold: 3,
      icon: "🌈",
      rarity: "uncommon",
    },
    {
      name: "Renaissance Soul",
      description: "Complete habits in 5 different categories",
      type: "variety",
      threshold: 5,
      icon: "🎨",
      rarity: "rare",
    },
    {
      name: "Life Harmonizer",
      description: "Complete habits in all 10 categories",
      type: "variety",
      threshold: 10,
      icon: "☯️",
      rarity: "epic",
    },

    // ===== CONSISTENCY ACHIEVEMENTS =====
    {
      name: "Daily Devotee",
      description: "Create 5 daily habits",
      type: "daily_habits",
      threshold: 5,
      icon: "🌅",
      rarity: "uncommon",
    },
    {
      name: "Habit Architect",
      description: "Maintain 10 active habits",
      type: "active_habits",
      threshold: 10,
      icon: "🏗️",
      rarity: "rare",
    },

    // ===== SPECIAL ACHIEVEMENTS =====
    {
      name: "Perfect Week",
      description: "Complete all habits for 7 consecutive days",
      type: "perfect_week",
      threshold: 1,
      icon: "✨",
      rarity: "epic",
    },
    {
      name: "Early Bird",
      description: "Complete 50 habits before 9 AM",
      type: "early_completion",
      threshold: 50,
      icon: "🐦",
      rarity: "rare",
    },
    {
      name: "Night Owl",
      description: "Complete 50 habits after 8 PM",
      type: "late_completion",
      threshold: 50,
      icon: "🦉",
      rarity: "rare",
    },
  ];

  let newAchievements = [];

  achievements.forEach((achievement) => {
    const hasAchievement = this.achievements.find(
      (a) => a.name === achievement.name
    );

    if (!hasAchievement) {
      let shouldAward = false;

      switch (achievement.type) {
        case "habits":
        case "streak":
        case "points":
          shouldAward =
            achievement.type === type && value >= achievement.threshold;
          break;
        case "category":
          shouldAward =
            type === "category" &&
            category === achievement.category &&
            value >= achievement.threshold;
          break;
        case "variety":
          shouldAward = type === "variety" && value >= achievement.threshold;
          break;
        case "daily_habits":
          shouldAward =
            type === "daily_habits" && value >= achievement.threshold;
          break;
        case "active_habits":
          shouldAward =
            type === "active_habits" && totalHabits >= achievement.threshold;
          break;
        default:
          // Special achievements handled elsewhere
          break;
      }

      if (shouldAward) {
        const newAchievement = {
          ...achievement,
          unlockedAt: new Date(),
        };
        this.achievements.push(newAchievement);
        newAchievements.push(newAchievement);
      }
    }
  });

  if (newAchievements.length > 0) {
    await this.save();
  }

  return newAchievements;
};

const User = mongoose.model("User", userSchema);
export default User;
