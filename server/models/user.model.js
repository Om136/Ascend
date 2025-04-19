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
    enum: ["streak", "points", "habits"],
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

// Calculate user level based on points
userSchema.methods.calculateLevel = function () {
  // Points needed for each level = level * 1000
  const level = Math.floor(this.totalPoints / 1000) + 1;
  return Math.min(level, 10); // Cap at level 10 (Master)
};

// Get level title based on level number
userSchema.methods.getLevelTitle = function () {
  const titles = {
    1: "Beginner",
    2: "Novice",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
    6: "Master",
    7: "Grand Master",
    8: "Elite",
    9: "Legend",
    10: "Enlightened",
  };
  return titles[this.level] || "Unknown";
};

// Check and award achievements
userSchema.methods.checkAchievements = async function (type, value) {
  const achievements = [
    {
      name: "First Steps",
      description: "Complete your first habit",
      type: "habits",
      threshold: 1,
      icon: "🎯",
    },
    {
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      type: "streak",
      threshold: 7,
      icon: "🔥",
    },
    {
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      type: "streak",
      threshold: 30,
      icon: "⭐",
    },
    {
      name: "Century Club",
      description: "Earn 100 points",
      type: "points",
      threshold: 100,
      icon: "💯",
    },
    {
      name: "Point Master",
      description: "Earn 1000 points",
      type: "points",
      threshold: 1000,
      icon: "🏆",
    },
  ];

  let newAchievements = false;

  achievements.forEach((achievement) => {
    if (
      achievement.type === type &&
      value >= achievement.threshold &&
      !this.achievements.find((a) => a.name === achievement.name)
    ) {
      this.achievements.push({
        ...achievement,
        unlockedAt: new Date(),
      });
      newAchievements = true;
    }
  });

  if (newAchievements) {
    await this.save();
  }
};

const User = mongoose.model("User", userSchema);
export default User;
