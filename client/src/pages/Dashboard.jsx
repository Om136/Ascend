import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  Trophy,
  Award,
  Filter,
  BarChart3,
  Bell,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Achievement, AchievementModal } from "@/components/ui/achievement";
import NotificationService from "@/services/NotificationService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "Daily",
    category: "Other",
    reminderEnabled: false,
    reminderTime: "09:00",
    reminderDays: [1, 2, 3, 4, 5, 6, 0], // All days
  });
  const [userStats, setUserStats] = useState({
    level: 1,
    levelTitle: "Beginner",
    totalPoints: 0,
    achievements: [],
    nextLevelInfo: { nextLevelPoints: 100, pointsNeeded: 100, progress: 0 },
  });
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsResponse, categoriesResponse] = await Promise.all([
          api.get("/habits"),
          api.get("/habits/categories"),
        ]);

        setHabits(habitsResponse.data.habits);
        setUserStats(habitsResponse.data.user);
        setCategories(categoriesResponse.data);

        // Schedule notifications for habits with reminders enabled
        NotificationService.scheduleHabitReminders(habitsResponse.data.habits);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addHabit = async ({
    name,
    description,
    frequency,
    category,
    reminderEnabled,
    reminderTime,
    reminderDays,
  }) => {
    try {
      const newHabitData = {
        name,
        description,
        frequency,
        category,
        reminderEnabled,
        reminderTime,
        reminderDays,
      };
      console.log(newHabitData);

      const response = await api.post("/habits", newHabitData);

      // Update habits state with the new habit from server response
      setHabits([...habits, response.data]);

      // Reset form
      setNewHabit({
        name: "",
        description: "",
        frequency: "Daily",
        category: "Other",
        reminderEnabled: false,
        reminderTime: "09:00",
        reminderDays: [1, 2, 3, 4, 5, 6, 0],
      });
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const completeHabit = async (id) => {
    try {
      const response = await api.post(`/habits/${id}/complete`, {});

      // Update habit in state
      setHabits(
        habits.map((habit) => (habit._id === id ? response.data.habit : habit))
      );

      // Update user stats
      setUserStats({
        level: response.data.user.level,
        levelTitle: response.data.user.levelTitle,
        totalPoints: response.data.user.totalPoints,
        achievements: response.data.user.achievements,
        nextLevelInfo: response.data.user.nextLevelInfo,
      });

      // Handle new achievements
      if (
        response.data.newAchievements &&
        response.data.newAchievements.length > 0
      ) {
        setNewAchievements(response.data.newAchievements);

        // Show achievement notification
        const achievementCount = response.data.newAchievements.length;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🏆 Achievement Unlocked!", {
            body:
              achievementCount === 1
                ? `You unlocked: ${response.data.newAchievements[0].name}!`
                : `You unlocked ${achievementCount} new achievements!`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          });
        }

        // Auto-show achievement modal if new achievements
        setTimeout(() => setShowAchievementModal(true), 500);
      }
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const navigateToHabitDetails = (habitId) => {
    navigate(`/habits/${habitId}`);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if server call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header with Logout */}
      <div className="relative">
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/90 p-2 rounded-full"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel className="text-gray-600">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 mb-8 overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white opacity-15 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-40 h-40 bg-yellow-300 opacity-25 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-pink-300 opacity-20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-emerald-400 opacity-15 rounded-full blur-2xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 animate-gradient-x">
                Ascend
              </span>{" "}
              <span className="text-5xl animate-bounce inline-block">✨</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-4">
              &ldquo;We are what we repeatedly do. Excellence, then, is not an
              act, but a habit.&rdquo;
            </p>
            <div className="text-lg opacity-80 mb-8">— Aristotle</div>
            <div className="flex items-center justify-center gap-3 text-lg opacity-90">
              <span className="animate-pulse">🚀</span>
              <span>Transform your life, one habit at a time</span>
              <span className="animate-pulse">🌟</span>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() =>
                document
                  .getElementById("habit-form")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Habit
            </Button>
            <Button
              onClick={() => navigate("/analytics")}
              variant="outline"
              className="border-2 bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30  px-8 py-3 text-lg font-semibold rounded-xl hover:text-white transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <Card className="mb-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-2xl relative overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
          {/* Enhanced glassmorphism overlay */}
          <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-300 to-orange-400 opacity-25 rounded-full blur-3xl -translate-y-6 translate-x-6 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-300 to-teal-400 opacity-20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-md border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
                  <Trophy className="h-8 w-8 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <div className="text-4xl font-bold flex items-center gap-2">
                    Level {userStats.level}
                    {userStats.level >= 5 && (
                      <span className="text-2xl">👑</span>
                    )}
                    {userStats.level >= 10 && (
                      <span className="text-2xl">⭐</span>
                    )}
                  </div>
                  <div className="text-indigo-100 text-lg font-medium">
                    {userStats.levelTitle}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  {userStats.totalPoints}
                </div>
                <div className="text-indigo-100 text-lg font-medium">
                  Total Points
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-6">
              <div className="flex justify-between text-lg font-medium">
                <span>Progress to Level {userStats.level + 1}</span>
                <span className="text-yellow-300 font-bold text-xl">
                  {userStats.nextLevelInfo?.progress || 0}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full h-6 bg-white bg-opacity-20 rounded-full backdrop-blur-sm border border-white/20">
                  <div
                    className="h-6 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:shadow-lg"
                    style={{
                      width: `${userStats.nextLevelInfo?.progress || 0}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-30 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🎯</span>
                <p className="text-center text-indigo-100 text-lg font-medium">
                  {userStats.nextLevelInfo?.pointsNeeded || 0} points until next
                  level
                </p>
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 text-white border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-15 rounded-full blur-2xl -translate-y-3 translate-x-3 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-emerald-200 opacity-20 rounded-full blur-xl translate-y-2 -translate-x-2"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">
                    Today&apos;s Progress
                  </p>
                  <p className="text-4xl font-bold mt-2 flex items-center gap-2">
                    {filteredHabits.filter((h) => h.completed).length}/
                    {filteredHabits.length}
                    {filteredHabits.filter((h) => h.completed).length ===
                      filteredHabits.length &&
                      filteredHabits.length > 0 && (
                        <span className="text-2xl animate-bounce">🎉</span>
                      )}
                  </p>
                  <p className="text-emerald-200 text-sm mt-1 font-medium">
                    habits completed
                  </p>
                  {filteredHabits.length > 0 && (
                    <div className="mt-3 w-full bg-emerald-600/30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (filteredHabits.filter((h) => h.completed).length /
                              filteredHabits.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-md group-hover:bg-opacity-30 transition-all duration-300">
                  <CheckCircle className="h-10 w-10 text-emerald-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 text-white border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-15 rounded-full blur-2xl -translate-y-3 translate-x-3 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-200 opacity-20 rounded-full blur-xl translate-y-2 -translate-x-2"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">
                    Best Streak
                  </p>
                  <p className="text-4xl font-bold mt-2 flex items-center gap-2">
                    <span className="animate-pulse text-3xl">🔥</span>
                    <span>{Math.max(...habits.map((h) => h.streak), 0)}</span>
                    {Math.max(...habits.map((h) => h.streak), 0) >= 7 && (
                      <span className="text-2xl">💪</span>
                    )}
                  </p>
                  <p className="text-orange-200 text-sm mt-1 font-medium">
                    days in a row
                  </p>
                  {Math.max(...habits.map((h) => h.streak), 0) > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                      {[
                        ...Array(
                          Math.min(
                            5,
                            Math.max(...habits.map((h) => h.streak), 0)
                          )
                        ),
                      ].map((_, i) => (
                        <span
                          key={i}
                          className="text-yellow-300 text-lg animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-md group-hover:bg-opacity-30 transition-all duration-300">
                  <Award className="h-10 w-10 text-orange-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-15 rounded-full blur-2xl -translate-y-3 translate-x-3 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-200 opacity-20 rounded-full blur-xl translate-y-2 -translate-x-2"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">
                    Total Habits
                  </p>
                  <p className="text-4xl font-bold mt-2 flex items-center gap-2">
                    {habits.length}
                    {habits.length >= 5 && <span className="text-2xl">🎯</span>}
                    {habits.length >= 10 && (
                      <span className="text-2xl">🏆</span>
                    )}
                  </p>
                  <p className="text-blue-200 text-sm mt-1 font-medium">
                    active habits
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {habits.slice(0, 6).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white rounded-full opacity-60"
                      ></div>
                    ))}
                    {habits.length > 6 && (
                      <div className="text-xs text-blue-200 ml-1">
                        +{habits.length - 6}
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-md group-hover:bg-opacity-30 transition-all duration-300">
                  <Trophy className="h-10 w-10 text-blue-100" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {userStats.achievements.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Award className="mr-2 h-6 w-6" />
                Recent Achievements ({userStats.achievements.length})
              </h2>
              <Button
                onClick={() => setShowAchievementModal(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>View All</span>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userStats.achievements.slice(-6).map((achievement) => (
                <Achievement key={achievement.name} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-10 gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              My Habits
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed max-w-2xl">
              Build consistency, track progress, achieve greatness ✨
            </p>
            {filteredHabits.length > 0 && (
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-4">
                <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  🎯 {filteredHabits.length} Active Habits
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  ✅ {filteredHabits.filter((h) => h.completed).length}{" "}
                  Completed Today
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
            <Button
              variant="outline"
              onClick={() => navigate("/analytics")}
              className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              View Analytics
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl"
                >
                  <Filter className="mr-3 h-5 w-5" />
                  {selectedCategory === "All"
                    ? "All Categories"
                    : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <DropdownMenuRadioItem value="All">
                    All Categories
                  </DropdownMenuRadioItem>
                  {categories.map((category) => (
                    <DropdownMenuRadioItem key={category} value={category}>
                      {category}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHabits.map((habit) => (
            <div key={habit._id}>
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 relative overflow-hidden ${
                  habit.completed
                    ? "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 shadow-emerald-200/50"
                    : "bg-white shadow-xl hover:shadow-indigo-200/50"
                }`}
                onClick={() => navigateToHabitDetails(habit._id)}
              >
                {/* Decorative elements */}
                <div
                  className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -translate-y-2 translate-x-2 ${
                    habit.completed
                      ? "bg-emerald-300 opacity-20"
                      : "bg-indigo-300 opacity-15"
                  }`}
                ></div>

                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            habit.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {habit.completed && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="truncate text-lg font-semibold text-gray-800">
                          {habit.name}
                        </span>
                        {habit.reminderEnabled && (
                          <div className="bg-blue-100 p-1 rounded-full">
                            <Bell
                              className="h-3 w-3 text-blue-600"
                              title="Reminders enabled"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            habit.category === "Health"
                              ? "bg-rose-100 text-rose-700 border border-rose-200"
                              : habit.category === "Fitness"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : habit.category === "Learning"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : habit.category === "Work"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : habit.category === "Productivity"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {habit.category}
                        </span>
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1 rounded-full border border-orange-200">
                          <span className="text-orange-500 text-lg">🔥</span>
                          <span className="text-sm font-bold text-orange-700">
                            {habit.streak}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardTitle>
                  {habit.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {habit.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <Button
                    className={`w-full transition-all duration-300 font-semibold py-3 ${
                      habit.completed
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-emerald-300/50"
                        : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-300/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      completeHabit(habit._id);
                    }}
                    disabled={habit.completed}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {habit.completed ? "✨ Completed Today!" : "Complete Habit"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <Card
          id="habit-form"
          className="mt-12 border-0 shadow-2xl bg-white relative overflow-hidden"
        >
          {/* Enhanced decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-10 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-300 to-rose-400 opacity-15 rounded-full blur-2xl translate-y-8 -translate-x-8"></div>

          <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg relative z-10">
            <CardTitle className="flex items-center text-3xl font-bold">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4 backdrop-blur-sm">
                <Plus className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  Create New Habit
                  <span className="text-2xl animate-bounce">🌟</span>
                </div>
                <p className="text-indigo-100 mt-2 text-lg font-normal">
                  Start building a new positive habit today
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 relative z-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-lg font-bold text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                  Habit Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Drink 8 glasses of water, Read for 30 minutes, Exercise for 20 minutes..."
                  value={newHabit.name}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg py-4 px-4 rounded-xl shadow-sm hover:shadow-md"
                />
                <p className="text-sm text-gray-500 ml-3">
                  Choose a clear, specific name for your habit
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-bold text-gray-700 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Why is this habit important to you? What motivates you to stick with it? How will it improve your life?"
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                  className="min-h-[120px] border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md resize-none"
                />
                <p className="text-sm text-gray-500 ml-3">
                  Adding a meaningful description helps you stay motivated
                </p>
              </div>

              {/* Enhanced Reminder Settings */}
              <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-300 opacity-10 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-gray-700">
                        Smart Reminders
                      </span>
                      <p className="text-sm text-gray-600">
                        Never miss your habit with intelligent notifications
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={newHabit.reminderEnabled ? "default" : "outline"}
                    size="lg"
                    onClick={async () => {
                      if (!newHabit.reminderEnabled) {
                        const granted =
                          await NotificationService.requestPermission();
                        if (granted) {
                          setNewHabit({ ...newHabit, reminderEnabled: true });
                          NotificationService.testNotification();
                        }
                      } else {
                        setNewHabit({ ...newHabit, reminderEnabled: false });
                      }
                    }}
                    className={
                      newHabit.reminderEnabled
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg"
                        : "border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    }
                  >
                    {newHabit.reminderEnabled
                      ? "✅ Enabled"
                      : "Enable Reminders"}
                  </Button>
                </div>

                {newHabit.reminderEnabled && (
                  <div className="space-y-4 pt-4 border-t border-blue-200 relative z-10">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Reminder Time
                      </label>
                      <Input
                        type="time"
                        value={newHabit.reminderTime}
                        onChange={(e) =>
                          setNewHabit({
                            ...newHabit,
                            reminderTime: e.target.value,
                          })
                        }
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        📱 Perfect! You&apos;ll receive beautiful browser
                        notifications at {newHabit.reminderTime} to help you
                        stay consistent with your habits.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Frequency
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-indigo-300 text-left justify-start py-3"
                      >
                        📅 {newHabit.frequency}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Frequency</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={newHabit.frequency}
                        onValueChange={(value) =>
                          setNewHabit({ ...newHabit, frequency: value })
                        }
                      >
                        <DropdownMenuRadioItem value="Daily">
                          Daily
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Weekly">
                          Weekly
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Monthly">
                          Monthly
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-purple-300 text-left justify-start py-3"
                      >
                        🏷️ {newHabit.category}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={newHabit.category}
                        onValueChange={(value) =>
                          setNewHabit({ ...newHabit, category: value })
                        }
                      >
                        {categories.map((category) => (
                          <DropdownMenuRadioItem
                            key={category}
                            value={category}
                          >
                            {category}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Action
                  </label>
                  <Button
                    onClick={() => addHabit(newHabit)}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Habit ✨
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Modal */}
        {showAchievementModal && (
          <AchievementModal
            achievements={userStats.achievements}
            newAchievements={newAchievements}
            onClose={() => {
              setShowAchievementModal(false);
              setNewAchievements([]);
            }}
          />
        )}
      </div>
    </div>
  );
}
