import axios from "axios";

export interface LocationIQPlace {
  lat: number;
  lon: number;
  display_name: string;
}

export class MapService {
  private static key = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;

  // --- Search address bằng query ---
  static async searchAddress(query: string): Promise<LocationIQPlace | null> {
    if (!this.key) throw new Error("LocationIQ API key not set");

    try {
      const url = `https://us1.locationiq.com/v1/search.php?key=${
        this.key
      }&q=${encodeURIComponent(query)}&format=json`;

      const res = await axios.get(url);

      if (res.data && res.data.length > 0) {
        const place = res.data[0];
        return {
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
          display_name: place.display_name,
        };
      }

      return null;
    } catch (err) {
      console.error("MapService searchAddress error:", err);
      return null;
    }
  }

  // --- Reverse geocode: từ lat/lon ra địa chỉ ---
  static async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<LocationIQPlace | null> {
    if (!this.key) throw new Error("LocationIQ API key not set");

    try {
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${this.key}&lat=${lat}&lon=${lon}&format=json`;

      const res = await axios.get(url);

      if (res.data) {
        return {
          lat: parseFloat(res.data.lat),
          lon: parseFloat(res.data.lon),
          display_name: res.data.display_name,
        };
      }

      return null;
    } catch (err) {
      console.error("MapService reverseGeocode error:", err);
      return null;
    }
  }
}
