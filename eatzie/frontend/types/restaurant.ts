// Base interface chứa các field chung
interface BaseRestaurant {
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  status: string;
}

export interface RestaurantModel extends BaseRestaurant {}

export interface RestaurantItem extends BaseRestaurant {
  id: number;
  foods?: any[];
  categories?: any[];
}

export interface RestaurantResult {
  id: number;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status: string;
  createdAt: string;
  restaurantFoods: any[] | null;
  foodCategories: any[] | null;
}
