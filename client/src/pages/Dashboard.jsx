import { useState, useEffect } from "react";
import { Plus, CheckCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: "", frequency: "Daily" });
  const [totalPoints, setTotalPoints] = useState(150);
  const [position, setPosition] = useState("bottom");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/api/habits", {
        withCredentials: true,
      });
      console.log(response.data); // Use the response data
      setHabits(response.data);
    };

    fetchData();
  }, []);

  const addHabit = ({ name, frequency }) => {
    console.log(newHabit);
    const newHabit = {
      name,
      frequency,
    };

    axios.post("http://localhost:8000/api/habits", newHabit, {
      withCredentials: true,
    });
  };

  // const completeHabit = (id) => {
  //   setHabits(
  //     habits.map((habit) =>
  //       habit._id)} === id
  //         ? { ...habit, streak: habit.streak + 1, completed: true }
  //         : habit
  //     )
  //   );
  //   setTotalPoints(totalPoints + 10);
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Habit Dashboard</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
            Total Points: {totalPoints}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={totalPoints % 100} className="w-full" />
          <p className="text-center mt-2 text-sm text-muted-foreground">
            {100 - (totalPoints % 100)} points until next level
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <div key={habit._id}>
            <Card key={habit._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{habit.name}</span>
                  {/* <div className=" flex gap-5"> */}

                  <span className="text-sm font-normal text-muted-foreground">
                    Frequency: {habit.frequency}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Streak: {habit.streak}
                  </span>
                  {/* </div> */}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  // onClick={() => completeHabit(habit._id)}
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
            <Button onClick={() => addHabit(newHabit)}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={setPosition}
                >
                  <DropdownMenuRadioItem value="top">Daily</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="bottom">
                    Weekly
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="right">
                    Monthly
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
