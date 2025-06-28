import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  get: async (key: string) => await AsyncStorage.getItem(key),
  set: async (key: string, value: string) =>
    await AsyncStorage.setItem(key, value),
  remove: async (key: string) => await AsyncStorage.removeItem(key),
};
