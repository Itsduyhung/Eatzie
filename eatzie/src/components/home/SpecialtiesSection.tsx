import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { getFoodById, FoodBriefResponse } from "@/infrastructure/api/foodApi";
import { SizableImage } from "@/components/ui/SizableImageProps";

const IDS = [14, 34, 35, 36];

export function SpecialtiesSection() {
  const [items, setItems] = useState<FoodBriefResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log("[Specialties] Starting to fetch data for IDs:", IDS);
    console.log("[Specialties] API Base URL:", process.env.EXPO_PUBLIC_API_URL);
    
    Promise.allSettled(IDS.map((id) => {
      console.log(`[Specialties] Fetching food with ID: ${id}`);
      return getFoodById(id);
    }))
      .then((results) => {
        console.log("[Specialties] All API calls completed:", results);
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
        
        console.log("[Specialties] Filtered results:", filtered);
        if (filtered.length === 0) {
          console.warn("[Specialties] No data returned for ids:", IDS);
          console.warn("[Specialties] Raw results:", results);
        }
        if (mounted) setItems(filtered);
      })
      .catch((error) => {
        console.error("[Specialties] Error fetching data:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <YStack width="100%" backgroundColor="#FFFFFF" borderRadius={14} padding="$2">
      <Text fontSize="$5" fontFamily="$heading" color="#111827" marginBottom={8}>
        Đặc sản
      </Text>
      {loading && (
        <XStack justifyContent="center" paddingVertical={16}>
          <ActivityIndicator />
        </XStack>
      )}
      <FlatList
        horizontal
        data={items}
        keyExtractor={(it) => String(it.id)}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <YStack width={220} borderRadius={12} backgroundColor="#F5F5F5" padding={10}>
            <YStack borderRadius={8} overflow="hidden" aspectRatio={3 / 2}>
              <SizableImage source={{ uri: item.imageUrl }} resizeMode="cover" borderRadius={2} />
            </YStack>
            <Text fontSize="$3" fontWeight="700" marginTop={8} numberOfLines={1} color="#000000">
              {item.content ?? ""}
            </Text>
            <Text fontSize="$2" color="#000000" marginTop={2} numberOfLines={1} fontWeight="600">
              {item.restaurantName ?? ""}
            </Text>
          </YStack>
        )}
      />
    </YStack>
  );
}


