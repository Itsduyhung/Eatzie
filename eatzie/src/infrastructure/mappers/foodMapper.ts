import { FoodSearchResult } from "@/domain/service/SearchService";

export interface FoodItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  isVegetarian: boolean;
  totalViews: number;
  averageRating: number;
  address?: string | null;
  restaurantName?: string | null;
  value: number;
  price: number;
  priceFormatted: string;
}

const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

export function formatPriceVND(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function mapFoodApiToFoodItem(api: FoodSearchResult): FoodItem {
  const price = api.price ?? 0;
  return {
    id: api.id,
    title: api.content ?? "",
    description: api.description ?? "",
    imageUrl: api.imageUrl ?? DEFAULT_IMAGE,
    isVegetarian: !!api.isVegetarian,
    totalViews: api.totalViews ?? 0,
    averageRating: api.averageRating ?? 0,
    address: api.address ?? null,
    restaurantName: api.restaurantName ?? "Duy Hùng Res",
    value: api.value ?? 0,
    price,
    priceFormatted: formatPriceVND(price),
  };
}
