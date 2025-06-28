import { decode as atob } from "base-64";
export function getValidPayLoad(token: string): any | null {
  try {
    if (!token || typeof token !== "string") return null;
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;

    const json = atob(payloadBase64);
    return JSON.parse(json);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isTokenValid(token: string): boolean {
  try {
    const payload = getValidPayLoad(token);
    if (!payload?.exp) return false;
    const expirationTime = payload.exp * 1000;
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
}
