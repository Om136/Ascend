class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.scheduledNotifications = new Map();
  }

  async requestPermission() {
    if ("Notification" in window) {
      this.permission = await Notification.requestPermission();
      return this.permission === "granted";
    }
    return false;
  }

  scheduleHabitReminders(habits) {
    // Clear existing notifications
    this.clearAllNotifications();

    habits.forEach((habit) => {
      if (habit.reminderEnabled) {
        this.scheduleHabitReminder(habit);
      }
    });
  }

  scheduleHabitReminder(habit) {
    if (this.permission !== "granted") return;

    const now = new Date();
    const [hours, minutes] = habit.reminderTime.split(":").map(Number);

    habit.reminderDays.forEach((dayOfWeek) => {
      const reminderDate = new Date();

      // Set time
      reminderDate.setHours(hours, minutes, 0, 0);

      // Calculate next occurrence of this day
      const daysUntilTarget = (dayOfWeek - now.getDay() + 7) % 7;
      if (daysUntilTarget === 0 && reminderDate <= now) {
        // If it's today but time has passed, schedule for next week
        reminderDate.setDate(reminderDate.getDate() + 7);
      } else {
        reminderDate.setDate(reminderDate.getDate() + daysUntilTarget);
      }

      const timeUntilReminder = reminderDate.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        const timeoutId = setTimeout(() => {
          this.showNotification(habit);
          // Reschedule for next week
          setTimeout(() => this.scheduleHabitReminder(habit), 1000);
        }, timeUntilReminder);

        const key = `${habit._id}-${dayOfWeek}`;
        this.scheduledNotifications.set(key, timeoutId);
      }
    });
  }

  showNotification(habit) {
    if (this.permission === "granted") {
      const notification = new Notification(`Time for: ${habit.name}`, {
        body:
          habit.description ||
          `Don't forget to complete your ${habit.frequency.toLowerCase()} habit!`,
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: habit._id,
        requireInteraction: true,
        actions: [
          {
            action: "complete",
            title: "Mark Complete",
          },
          {
            action: "dismiss",
            title: "Dismiss",
          },
        ],
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = `/habits/${habit._id}`;
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  }

  clearAllNotifications() {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  clearHabitNotifications(habitId) {
    const keysToDelete = [];
    this.scheduledNotifications.forEach((timeoutId, key) => {
      if (key.startsWith(habitId)) {
        clearTimeout(timeoutId);
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.scheduledNotifications.delete(key));
  }

  // Check for overdue habits and show notifications
  checkOverdueHabits(habits) {
    const now = new Date();
    const currentHour = now.getHours();

    // Only check during reasonable hours (8 AM - 10 PM)
    if (currentHour < 8 || currentHour > 22) return;

    habits.forEach((habit) => {
      if (habit.reminderEnabled && !habit.completed) {
        const [reminderHours] = habit.reminderTime.split(":").map(Number);
        const hoursLate = currentHour - reminderHours;

        // If habit is 2+ hours overdue, show gentle reminder
        if (hoursLate >= 2 && hoursLate <= 6) {
          this.showOverdueNotification(habit, hoursLate);
        }
      }
    });
  }

  showOverdueNotification(habit, hoursLate) {
    if (this.permission === "granted") {
      new Notification(`Gentle reminder: ${habit.name}`, {
        body: `This habit was scheduled ${hoursLate} hours ago. It's not too late to complete it!`,
        icon: "/vite.svg",
        tag: `overdue-${habit._id}`,
      });
    }
  }

  // Test notification
  testNotification() {
    if (this.permission === "granted") {
      new Notification("Test Notification", {
        body: "Your notifications are working perfectly! 🎉",
        icon: "/vite.svg",
      });
    }
  }
}

export default new NotificationService();
