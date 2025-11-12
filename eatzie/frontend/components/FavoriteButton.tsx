import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable } from "react-native";
import { XStack } from "tamagui";

type FavoriteButtonProps = {
  initialLiked?: boolean;
};

export const FavoriteButton = ({
  initialLiked = false,
}: FavoriteButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);

  return (
    <Pressable onPress={() => setLiked(!liked)}>
      <XStack
        width={30}
        height={30}
        justifyContent="center"
        alignItems="center"
        borderRadius={17}
        backgroundColor={liked ? "red" : "#E5E7EB"}
      >
        <FontAwesome
          name={liked ? "heart" : "heart-o"}
          size={16}
          color="white"
        />
      </XStack>
    </Pressable>
  );
};
