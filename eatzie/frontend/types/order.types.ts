export type OrderItemProps = {
  totalPrice: number;
  note: string;
  foodId: number;
  foodName: string;
  quantity: number;
  price: number;
  imageUrl: string;
};

export type OrderFoodIdProps = Pick<OrderItemProps, "foodId">;

export type OrderCreateResProps = {
  orderId: number;
  createdAt: string;
  totalAmount?: number;
  status: string;
  items: OrderItemProps[];
};

export type OrderItemRawProps = {
  totalPrice: number;
  note: string;
  foodId: number;
  foodName: string;
  quantity: number;
  imageUrl: string | null;
  price: number;
};

export type OrderCreateResRawProps = {
  orderId: number;
  createdAt: string;
  totalAmount?: number;
  status: string;
  items: OrderItemRawProps[];
};
