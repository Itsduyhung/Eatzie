// src/components/ui/RatingStars.tsx
import { FontAwesome } from "@expo/vector-icons";
import { XStack } from "tamagui";

type RatingStarsProps = {
  value: number;
  size?: number;
  color?: string;
};

export const RatingStars = ({
  value,
  size = 16,
  color = "#FACC15",
}: RatingStarsProps) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(value)) {
      stars.push(<FontAwesome key={i} name="star" size={size} color={color} />);
    } else if (i === Math.floor(value) + 1 && value % 1 >= 0.5) {
      stars.push(
        <FontAwesome key={i} name="star-half-full" size={size} color={color} />
      );
    } else {
      stars.push(
        <FontAwesome key={i} name="star-o" size={size} color={color} />
      );
    }
  }

  return <XStack gap="$1">{stars}</XStack>;
};
