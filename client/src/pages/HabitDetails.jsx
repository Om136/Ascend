import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Calendar, Target, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function HabitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/habits/${id}`, {
            withCredentials: true,
          }),
          axios.get("http://localhost:8000/api/habits/categories", {
            withCredentials: true,
          }),
        ]);
        setHabit(habitResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching habit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/habits/${id}/notes`,
        { content: newNote },
        { withCredentials: true }
      );
      setHabit(response.data);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const completeHabit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/habits/${id}/complete`,
        {},
        { withCredentials: true }
      );
      setHabit(response.data.habit);
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const updateCategory = async (newCategory) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/habits/${id}`,
        { category: newCategory },
        { withCredentials: true }
      );
      setHabit(response.data);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!habit) {
    return <div className="container mx-auto px-4 py-8">Habit not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-2xl block">{habit.name}</span>
                <div className="flex items-center text-sm font-normal text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" className="h-auto p-0">
                        {habit.category}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Change Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={habit.category}
                        onValueChange={updateCategory}
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
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                {habit.frequency}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Target className="mr-2 h-4 w-4" />
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{habit.streak} days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Total Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{habit.points}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {new Date(habit.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              className="w-full"
              onClick={completeHabit}
              disabled={habit.completed}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {habit.completed ? "Completed" : "Complete"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addNote} className="flex gap-2 mb-4">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
              />
              <Button type="submit">Add Note</Button>
            </form>

            <div className="space-y-4">
              {habit.notes && habit.notes.length > 0 ? (
                habit.notes.map((note, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <p>{note.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No notes yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
