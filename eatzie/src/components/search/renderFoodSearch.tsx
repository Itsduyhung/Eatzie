import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Text, YStack } from "tamagui";

import { CartItemSearch } from "@/components/ui/FoodCardItem";
import { SearchService } from "@/domain/service/SearchService";
import { FoodItemD } from "@/types/foodCategory";

type RenderFoodSearchProps = {
  initialQuery: string;
};

const RenderFoodSearch = ({ initialQuery }: RenderFoodSearchProps) => {
  const router = useRouter();
  const [cards, setCards] = useState<FoodItemD[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialQuery) {
      setCards([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const foods = await SearchService.search(initialQuery);
        setCards(foods);
      } catch (err: any) {
        console.error("Search error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialQuery]);

  const renderContent = () => {
    if (loading) return <Text p="$3">Loading...</Text>;
    if (error)
      return (
        <Text p="$3" color="red">
          {error}
        </Text>
      );
    if (cards.length === 0) return <Text p="$3">No results found</Text>;

    return (
      <YStack p="$2" gap="$2">
        {cards.map((card) => (
          <Pressable
            key={card.id}
            onPress={() =>
              router.push({
                pathname: "/(features)/food/contentfood",
                params: { id: card.id },
              })
            }
          >
            <CartItemSearch item={card} />
          </Pressable>
        ))}
      </YStack>
    );
  };

  return renderContent();
};

export default RenderFoodSearch;
