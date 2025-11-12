import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationState = {
  lat: number;
  lon: number;
  address: string;
  setLocation: (lat: number, lon: number, address: string) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      lat: 0,
      lon: 0,
      address: "",
      setLocation: (lat, lon, address) => set({ lat, lon, address }),
      clearLocation: () => set({ lat: 0, lon: 0, address: "" }),
    }),
    {
      name: "user-location",
    }
  )
);
