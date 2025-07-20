import { api } from "@/infrastructure/api/axiosClient";
import { LoginResponse } from "@/types/login/login";

export class AuthService {
  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const { data } = await api.post("SignIn/signin", credentials);
    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await api.post("", { currentRefreshToken: refreshToken });
    return data;
  }
}
