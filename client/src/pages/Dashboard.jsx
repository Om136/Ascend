import { useState, useEffect } from "react";
import { Plus, CheckCircle, Trophy, Award, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Achievement } from "@/components/ui/achievement";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newHabit, setNewHabit] = useState({
    name: "",
    frequency: "Daily",
    category: "Other",
  });
  const [userStats, setUserStats] = useState({
    level: 1,
    levelTitle: "Beginner",
    totalPoints: 0,
    achievements: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/habits", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/api/habits/categories", {
            withCredentials: true,
          }),
        ]);

        setHabits(habitsResponse.data.habits);
        setUserStats(habitsResponse.data.user);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addHabit = ({ name, frequency, category }) => {
    const newHabit = {
      name,
      frequency,
      category,
    };
    console.log(newHabit);

    axios.post("http://localhost:8000/api/habits", newHabit, {
      withCredentials: true,
    });
  };

  const completeHabit = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/habits/${id}/complete`,
        {},
        { withCredentials: true }
      );

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
      });
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const navigateToHabitDetails = (habitId) => {
    navigate(`/habits/${habitId}`);
  };

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        We are what we repeatedly do. Excellence, then, is not an act, but a
        habit.
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
              <span>
                Level {userStats.level} - {userStats.levelTitle}
              </span>
            </div>
            <span>{userStats.totalPoints} Points</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={((userStats.totalPoints % 1000) / 1000) * 100}
            className="w-full"
          />
          <p className="text-center mt-2 text-sm text-muted-foreground">
            {1000 - (userStats.totalPoints % 1000)} points until next level
          </p>
        </CardContent>
      </Card>

      {userStats.achievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Award className="mr-2 h-6 w-6" /> Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userStats.achievements.map((achievement) => (
              <Achievement key={achievement.name} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {selectedCategory}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
              {categories.map((category) => (
                <DropdownMenuRadioItem key={category} value={category}>
                  {category}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHabits.map((habit) => (
          <div key={habit._id}>
            <Card
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigateToHabitDetails(habit._id)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div>
                    <span className="truncate block">{habit.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {habit.category}
                    </span>
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    Streak: {habit.streak}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking the button
                    completeHabit(habit._id);
                  }}
                  disabled={habit.completed}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {habit.completed ? "Completed" : "Complete"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter new habit"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{newHabit.frequency}</Button>
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{newHabit.category}</Button>
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
                    <DropdownMenuRadioItem key={category} value={category}>
                      {category}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => addHabit(newHabit)}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
