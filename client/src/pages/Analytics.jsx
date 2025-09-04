import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressAnalytics from "@/components/ProgressAnalytics";
import axios from "axios";

export default function Analytics() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    levelTitle: "Beginner",
    totalPoints: 0,
    achievements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/habits", {
          withCredentials: true,
        });

        setHabits(response.data.habits);
        setUserStats(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.1),transparent)]"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <div className="text-lg font-medium text-gray-700">
                  Loading analytics...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.1),transparent)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent)]"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-10 blur-xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Modern Header */}
        <div className="mb-12">
          {/* Navigation and Title */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Track your progress and insights across all habits
                </p>
              </div>
            </div>

            {/* Level Badge */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Level {userStats.level}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {userStats.levelTitle}
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm text-gray-500">Total Points</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {userStats.totalPoints}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Analytics Overview
              </h3>
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {habits.length}
                </div>
                <div className="text-sm text-gray-600">Total Habits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {habits.filter((h) => h.completed).length}
                </div>
                <div className="text-sm text-gray-600">Completed Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {habits.length > 0
                    ? Math.round(
                        (habits.filter((h) => h.completed).length /
                          habits.length) *
                          100
                      )
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Component */}
        <ProgressAnalytics habits={habits} userStats={userStats} />
      </div>
    </div>
  );
}
