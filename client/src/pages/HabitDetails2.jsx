import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  Target,
  Tag,
  Bell,
} from "lucide-react";
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
import ReminderSettings from "@/components/ReminderSettings";
import NotificationService from "@/services/NotificationService";
import { api } from "@/lib/api";

export default function HabitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitResponse, categoriesResponse] = await Promise.all([
          api.get(`/habits/${id}`),
          api.get("/habits/categories"),
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
      const response = await api.post(`/habits/${id}/notes`, {
        notes: newNote,
      });
      setHabit(response.data);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const completeHabit = async () => {
    try {
      const response = await api.post(`/habits/${id}/complete`, {});
      setHabit(response.data.habit);
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  };

  const updateCategory = async (newCategory) => {
    try {
      const response = await api.patch(`/habits/${id}`, {
        category: newCategory,
      });
      setHabit(response.data);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const updateReminder = async (reminderSettings) => {
    try {
      await api.patch(`/habits/${id}/reminder`, reminderSettings);
      setHabit({ ...habit, ...reminderSettings });
      setShowReminderSettings(false);

      // Update notifications
      if (reminderSettings.reminderEnabled) {
        NotificationService.clearHabitNotifications(id);
        NotificationService.scheduleHabitReminder({
          ...habit,
          ...reminderSettings,
        });
      } else {
        NotificationService.clearHabitNotifications(id);
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!habit) {
    return <div className="container mx-auto px-4 py-8">Habit not found</div>;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
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
                <div className="flex items-center space-x-3">
                  <span className="text-2xl block">{habit.name}</span>
                  {habit.reminderEnabled && (
                    <Bell
                      className="h-5 w-5 text-blue-500"
                      title="Reminders enabled"
                    />
                  )}
                </div>
                <div className="flex items-center text-sm font-normal text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" className="h-auto p-0">
                        {habit.category}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
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
            {/* Reminder Settings Section */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="font-medium">Reminders</span>
                <span className="text-sm text-muted-foreground">
                  {habit.reminderEnabled
                    ? `Daily at ${habit.reminderTime}`
                    : "Disabled"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReminderSettings(true)}
              >
                {habit.reminderEnabled ? "Edit" : "Set up"}
              </Button>
            </div>

            {showReminderSettings && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <ReminderSettings
                  habit={habit}
                  onUpdate={updateReminder}
                  onClose={() => setShowReminderSettings(false)}
                />
              </div>
            )}

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {habit.streak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {habit.completions?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Completions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {habit.totalPoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Points Earned
                </div>
              </div>
            </div>

            {/* Description */}
            {habit.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {habit.description}
                </p>
              </div>
            )}

            {/* Complete Habit Button */}
            <Button
              onClick={completeHabit}
              disabled={habit.completed}
              className="w-full"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {habit.completed ? "Completed Today" : "Mark as Complete"}
            </Button>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Notes & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addNote} className="space-y-4">
              <Input
                placeholder="Add a note about your progress..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button type="submit" className="w-full">
                Add Note
              </Button>
            </form>

            {habit.notes && habit.notes.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Previous Notes</h3>
                {habit.notes
                  .slice()
                  .reverse()
                  .map((note, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm">{note.content}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(note.createdAt)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
