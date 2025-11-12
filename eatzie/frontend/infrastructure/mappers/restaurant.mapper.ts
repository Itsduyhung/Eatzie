import { RestaurantItem, RestaurantResult } from "@/types/restaurant";

export const mapRestaurantItemToCard = (
  data: RestaurantResult
): RestaurantItem => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    address: data.address,
    phone: data.phoneNumber,
    image: data.imageUrl,
    lat: data.latitude,
    lng: data.longitude,
    status: data.status,
    foods: data.restaurantFoods || [],
    categories: data.foodCategories || [],
  };
};
