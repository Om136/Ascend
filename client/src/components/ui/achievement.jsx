import { useState } from "react";
import { Button } from "./button";

const Achievement = ({ achievement, isNew = false }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "border-gray-400 bg-gray-50 text-gray-700";
      case "uncommon":
        return "border-green-400 bg-green-50 text-green-700";
      case "rare":
        return "border-blue-400 bg-blue-50 text-blue-700";
      case "epic":
        return "border-purple-400 bg-purple-50 text-purple-700";
      case "legendary":
        return "border-yellow-400 bg-yellow-50 text-yellow-700";
      default:
        return "border-gray-400 bg-gray-50 text-gray-700";
    }
  };

  const getRarityLabel = (rarity) => {
    return rarity?.charAt(0).toUpperCase() + rarity?.slice(1) || "Common";
  };

  return (
    <div
      className={`relative p-3 rounded-lg border-2 transition-all duration-500 ${getRarityColor(
        achievement.rarity
      )} ${isNew ? "animate-pulse scale-105 shadow-lg" : "hover:scale-102"}`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          NEW!
        </div>
      )}

      <div className="flex items-center space-x-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{achievement.name}</h3>
          <p className="text-sm opacity-80">{achievement.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${getRarityColor(
                achievement.rarity
              )}`}
            >
              {getRarityLabel(achievement.rarity)}
            </span>
            <span className="text-xs opacity-60">
              {new Date(achievement.unlockedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementModal = ({
  achievements = [],
  newAchievements = [],
  onClose,
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const rarityOrder = {
    legendary: 5,
    epic: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === "all") return true;
    return achievement.rarity === filter;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.unlockedAt) - new Date(a.unlockedAt);
    } else if (sortBy === "rarity") {
      return (rarityOrder[b.rarity] || 1) - (rarityOrder[a.rarity] || 1);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const rarityStats = achievements.reduce((acc, achievement) => {
    const rarity = achievement.rarity || "common";
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🏆 Achievements</h2>
              <p className="text-purple-100">
                {achievements.length} achievement
                {achievements.length !== 1 ? "s" : ""} unlocked
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-500"
            >
              ✕
            </Button>
          </div>

          {/* Rarity Summary */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <span
                key={rarity}
                className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm capitalize"
              >
                {rarity}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-600">Filter:</span>
              {["all", "legendary", "epic", "rare", "uncommon", "common"].map(
                (rarity) => (
                  <Button
                    key={rarity}
                    onClick={() => setFilter(rarity)}
                    variant={filter === rarity ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                  >
                    {rarity}
                  </Button>
                )
              )}
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-600">Sort:</span>
              {[
                { key: "newest", label: "Newest" },
                { key: "rarity", label: "Rarity" },
                { key: "name", label: "Name" },
              ].map((option) => (
                <Button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  variant={sortBy === option.key ? "default" : "outline"}
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* New Achievements Section */}
          {newAchievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-600 mb-3 flex items-center">
                ✨ Just Unlocked! ({newAchievements.length})
              </h3>
              <div className="grid gap-3">
                {newAchievements.map((achievement, index) => (
                  <Achievement
                    key={index}
                    achievement={achievement}
                    isNew={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Achievements */}
          <div className="overflow-y-auto max-h-96">
            <div className="grid gap-3">
              {sortedAchievements.map((achievement, index) => (
                <Achievement
                  key={index}
                  achievement={achievement}
                  isNew={newAchievements.some(
                    (newAch) => newAch.name === achievement.name
                  )}
                />
              ))}
            </div>

            {sortedAchievements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>No achievements found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Achievement, AchievementModal };
