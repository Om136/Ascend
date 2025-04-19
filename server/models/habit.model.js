import mongoose from "mongoose";

const CATEGORIES = [
  "Health",
  "Work",
  "Learning",
  "Fitness",
  "Mental Health",
  "Productivity",
  "Social",
  "Finance",
  "Creativity",
  "Other",
];

const completionSchema = new mongoose.Schema(
  {
    completedAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: CATEGORIES,
    default: "Other",
    required: true,
  },
  // description:{
  //     type:String,
  //     required:true,
  // },
  frequency: {
    type: String,
    required: true,
    enum: ["Daily", "Weekly", "Monthly"],
  },
  streak: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastCompleted: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastCompletedPeriod: {
    type: String, // Will store 'YYYY-MM-DD' for daily, 'YYYY-WW' for weekly, 'YYYY-MM' for monthly
    default: null,
  },
  notes: [
    {
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  completionHistory: [completionSchema],
});

// Add a method to check if habit can be completed again based on frequency
habitSchema.methods.canComplete = function () {
  if (!this.lastCompletedPeriod) return true;

  const now = new Date();
  const currentPeriod = this.getCurrentPeriod(now);
  return this.lastCompletedPeriod !== currentPeriod;
};

habitSchema.methods.getCurrentPeriod = function (date) {
  switch (this.frequency) {
    case "Daily":
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    case "Weekly":
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(
        ((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
      );
      return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
    case "Monthly":
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    default:
      return null;
  }
};

// Add static method to get all categories
habitSchema.statics.getCategories = function () {
  return CATEGORIES;
};

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
