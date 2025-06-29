import { api } from "@/infrastructure/api/axiosClient";

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    const { data } = await api.post("SignIn/signin", credentials);
    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await api.post("", { currentRefreshToken: refreshToken });
    return data;
  }
}
