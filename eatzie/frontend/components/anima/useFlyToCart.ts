import { useContext } from "react";
import { FlyToCartContext } from "./flyToCartManager";

export const useFlyToCart = () => {
  const context = useContext(FlyToCartContext);
  if (!context)
    throw new Error("useFlyToCart must be used within FlyToCartProvider");
  return { flyToCart: context.fly };
};
