import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { getFoodById, FoodBriefResponse } from "@/infrastructure/api/foodApi";
import { SizableImage } from "@/components/ui/SizableImageProps";
import { Star, Eye } from "@tamagui/lucide-icons";

export function ExploreSection() {
  const [items, setItems] = useState<FoodBriefResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const pickIds: number[] = [];
    while (pickIds.length < 6) {
      const id = Math.floor(Math.random() * 30) + 1;
      if (!pickIds.includes(id)) pickIds.push(id);
    }

    console.log("[Explore] Starting to fetch data for random IDs:", pickIds);
    console.log("[Explore] API Base URL:", process.env.EXPO_PUBLIC_API_URL);

    Promise.allSettled(pickIds.map((id) => {
      console.log(`[Explore] Fetching food with ID: ${id}`);
      return getFoodById(id);
    }))
      .then((results) => {
        console.log("[Explore] All API calls completed:", results);
        const filtered = results
          .filter((r) => r.status === "fulfilled" && !!(r as any).value)
          .map((r: any) => (r.value))
          .map((r: any) => ({
            id: r.id ?? r.Id,
            content: r.content ?? r.Content,
            description: r.description ?? r.Description,
            price: r.price ?? r.Price,
            imageUrl: r.imageUrl ?? r.ImageUrl,
            isVegetarian: r.isVegetarian ?? r.IsVegetarian,
            createdAt: r.createdAt ?? r.CreatedAt,
            restaurantName: r.restaurantName ?? r.RestaurantName,
            totalViews: r.totalViews ?? r.TotalViews,
            averageRating: r.averageRating ?? r.AverageRating,
            address: r.address ?? r.Address,
          })) as FoodBriefResponse[];
        
        console.log("[Explore] Filtered results:", filtered);
        if (filtered.length === 0) {
          console.warn("[Explore] No data returned for ids:", pickIds);
          console.warn("[Explore] Raw results:", results);
        }
        if (mounted) setItems(filtered);
      })
      .catch((error) => {
        console.error("[Explore] Error fetching data:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const renderCard = (item: FoodBriefResponse) => (
    <YStack width={190} backgroundColor="#F5F5F5" borderRadius={12} padding={10}>
      <YStack borderRadius={8} overflow="hidden" aspectRatio={1}>
        <SizableImage source={{ uri: item.imageUrl }} resizeMode="cover" borderRadius={2} />
      </YStack>
      <Text fontSize="$2" fontWeight="700" marginTop={8} numberOfLines={2} color="#000000">
        {item.content}
      </Text>
      <Text fontSize="$1" fontWeight="600" marginTop={2} numberOfLines={1} color="#000000">
        {item.restaurantName}
      </Text>
      <XStack alignItems="center" justifyContent="space-between" marginTop={6}>
        <XStack alignItems="center" gap="$1">
          <Star size={12} color="#8B5CF6" />
          <Text fontSize="$1" fontWeight="600" color="#000000">
            {item.averageRating ? item.averageRating.toFixed(1) : "0.0"}
          </Text>
        </XStack>
        <XStack alignItems="center" gap="$1">
          <Eye size={12} color="#8B5CF6" />
          <Text fontSize="$1" fontWeight="600" color="#6B7280">
            {item.totalViews ?? 0}
          </Text>
        </XStack>
      </XStack>
    </YStack>
  );

  return (
    <YStack width="100%" backgroundColor="#FFFFFF" borderRadius={14} padding="$2">
      <Text fontSize="$5" fontFamily="$heading" color="#111827" marginBottom={8}>
        Khám phá
      </Text>
      {loading && (
        <XStack justifyContent="center" paddingVertical={16}>
          <ActivityIndicator />
        </XStack>
      )}
      <FlatList
        data={items}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 4, gap: 8 }}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => renderCard(item)}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 4 }}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />
    </YStack>
  );
}