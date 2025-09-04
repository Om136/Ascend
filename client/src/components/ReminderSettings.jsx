import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Calendar } from "lucide-react";
import PropTypes from "prop-types";

const ReminderSettings = ({ habit, onUpdate, onClose }) => {
  const [reminderEnabled, setReminderEnabled] = useState(
    habit?.reminderEnabled || false
  );
  const [reminderTime, setReminderTime] = useState(
    habit?.reminderTime || "09:00"
  );
  const [reminderDays, setReminderDays] = useState(
    habit?.reminderDays || [1, 2, 3, 4, 5, 6, 0]
  );

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleDay = (dayIndex) => {
    setReminderDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    onUpdate({
      reminderEnabled,
      reminderTime,
      reminderDays,
    });
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setReminderEnabled(true);
        new Notification("Ascend Notifications", {
          body: "Great! You'll now receive habit reminders.",
          icon: "/vite.svg",
        });
      } else {
        alert(
          "Please enable notifications in your browser settings to receive reminders."
        );
      }
    } else {
      alert("Your browser doesn't support notifications.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Reminder Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Enable Reminders</span>
          <Button
            variant={reminderEnabled ? "default" : "outline"}
            size="sm"
            onClick={() =>
              reminderEnabled
                ? setReminderEnabled(false)
                : requestNotificationPermission()
            }
          >
            {reminderEnabled ? "Enabled" : "Enable"}
          </Button>
        </div>

        {reminderEnabled && (
          <>
            {/* Time Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Reminder Time
              </label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>

            {/* Days Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Reminder Days
              </label>
              <div className="flex space-x-1">
                {dayNames.map((day, index) => (
                  <Button
                    key={day}
                    variant={
                      reminderDays.includes(index) ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Frequency-based suggestions */}
            {habit?.frequency === "Daily" && (
              <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded">
                💡 Tip: For daily habits, consider setting reminders on all days
                for best results.
              </div>
            )}

            {habit?.frequency === "Weekly" && (
              <div className="text-xs text-muted-foreground p-2 bg-green-50 rounded">
                💡 Tip: Choose one specific day each week for your weekly habit.
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

ReminderSettings.propTypes = {
  habit: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ReminderSettings;
