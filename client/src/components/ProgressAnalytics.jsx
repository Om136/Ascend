import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, Calendar, Target, Trophy } from "lucide-react";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressAnalytics = ({ habits, userStats }) => {
  // Calculate completion rates by category
  const categoryData = () => {
    const categories = {};
    habits.forEach((habit) => {
      if (!categories[habit.category]) {
        categories[habit.category] = { total: 0, completed: 0 };
      }
      categories[habit.category].total++;
      if (habit.completed) {
        categories[habit.category].completed++;
      }
    });

    return {
      labels: Object.keys(categories),
      datasets: [
        {
          label: "Completion Rate (%)",
          data: Object.values(categories).map((cat) =>
            cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0
          ),
          backgroundColor: [
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(255, 205, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(199, 199, 199, 0.8)",
            "rgba(83, 102, 255, 0.8)",
            "rgba(255, 99, 255, 0.8)",
            "rgba(99, 255, 132, 0.8)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
            "rgba(83, 102, 255, 1)",
            "rgba(255, 99, 255, 1)",
            "rgba(99, 255, 132, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Calculate streak distribution
  const streakDistribution = () => {
    const streakRanges = {
      "0 days": 0,
      "1-7 days": 0,
      "8-30 days": 0,
      "31-90 days": 0,
      "90+ days": 0,
    };

    habits.forEach((habit) => {
      const streak = habit.streak || 0;
      if (streak === 0) streakRanges["0 days"]++;
      else if (streak <= 7) streakRanges["1-7 days"]++;
      else if (streak <= 30) streakRanges["8-30 days"]++;
      else if (streak <= 90) streakRanges["31-90 days"]++;
      else streakRanges["90+ days"]++;
    });

    return {
      labels: Object.keys(streakRanges),
      datasets: [
        {
          data: Object.values(streakRanges),
          backgroundColor: [
            "rgba(239, 68, 68, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(34, 197, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(147, 51, 234, 0.8)",
          ],
          borderColor: [
            "rgba(239, 68, 68, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(147, 51, 234, 1)",
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Calculate frequency distribution
  const frequencyData = () => {
    const frequencies = { Daily: 0, Weekly: 0, Monthly: 0 };
    habits.forEach((habit) => {
      frequencies[habit.frequency] = (frequencies[habit.frequency] || 0) + 1;
    });

    return {
      labels: Object.keys(frequencies),
      datasets: [
        {
          label: "Number of Habits",
          data: Object.values(frequencies),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 2,
        },
      ],
    };
  };

  // Calculate progress over time (simulated data for now)
  const progressOverTime = () => {
    const last7Days = [];
    const completionData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toLocaleDateString("en-US", { weekday: "short" }));

      // Simulate completion data (in a real app, this would come from completion history)
      const completedToday = Math.floor(Math.random() * habits.length);
      completionData.push(completedToday);
    }

    return {
      labels: last7Days,
      datasets: [
        {
          label: "Habits Completed",
          data: completionData,
          fill: false,
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.4,
          pointBackgroundColor: "rgba(34, 197, 94, 1)",
          pointBorderColor: "rgba(34, 197, 94, 1)",
          pointRadius: 5,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Total Habits Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              Total Habits
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {habits.length}
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              Completed Today
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {habits.filter((habit) => habit.completed).length}
          </div>
        </div>

        {/* Current Level Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              Current Level
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {userStats.level}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {userStats.levelTitle}
          </div>
        </div>

        {/* Total Points Card */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              Total Points
            </div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {userStats.totalPoints}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Category Completion Rates */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Completion Rate by Category
            </h3>
          </div>
          <div className="relative">
            <Bar data={categoryData()} options={chartOptions} />
          </div>
        </div>

        {/* Frequency Distribution */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Habits by Frequency
            </h3>
          </div>
          <div className="relative">
            <Bar data={frequencyData()} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Progress Over Time */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Progress Over Last 7 Days
            </h3>
          </div>
          <div className="relative">
            <Line data={progressOverTime()} options={chartOptions} />
          </div>
        </div>

        {/* Streak Distribution */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Streak Distribution
            </h3>
          </div>
          <div className="relative">
            <Doughnut data={streakDistribution()} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressAnalytics.propTypes = {
  habits: PropTypes.array.isRequired,
  userStats: PropTypes.object.isRequired,
};

export default ProgressAnalytics;
