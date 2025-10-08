export interface RestaurantResult {
  id: number;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  status: string;
  restaurantFoods: any[];
  foodCategories: any[];
}

export interface RestaurantItem {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  status: string;
  foods: any[];
  categories: any[];
}
