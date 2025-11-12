import { guessMimeTypeFromUri } from "@/app/untils/file";

type KeyMap<T> = {
  [K in keyof T]: string;
};

export function buildFormDataFromModel<T extends Record<string, any>>(
  data: T,
  keyMap: KeyMap<T>
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    const apiKey = keyMap[key as keyof T];
    if (!apiKey || value == null || value === "") continue;

    if (key === "image") {
      if (typeof value === "string") {
        formData.append(apiKey, {
          uri: value,
          name: `restaurantImage_${Date.now()}.jpg`,
          type: guessMimeTypeFromUri(value),
        } as any);
      } else if (value instanceof File) {
        formData.append(apiKey, value);
      }
    } else {
      formData.append(
        apiKey,
        typeof value === "number" ? String(value) : value
      );
    }
  }

  return formData;
}
