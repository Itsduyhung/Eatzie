import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  setItem: async (key: string, value: unknown) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  },

  getItem: async <T = unknown>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
