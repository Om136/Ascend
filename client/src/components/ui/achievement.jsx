import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Achievement({ achievement }) {
  return (
    <Card className="bg-secondary">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2">
          <span className="text-2xl">{achievement.icon}</span>
          <span>{achievement.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {achievement.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

Achievement.propTypes = {
  achievement: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    unlockedAt: PropTypes.string.isRequired,
  }).isRequired,
};
