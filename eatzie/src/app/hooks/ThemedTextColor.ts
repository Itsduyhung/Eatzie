import { createContext, useContext } from "react";

export const ThemedScreenContext = createContext<{ textColor: string } | null>(
  null
);

export const useThemedTextColor = () => {
  const context = useContext(ThemedScreenContext);
  if (!context) throw new Error("Must be used inside <ThemedScreen>");
  return context;
};
