import "axios";

declare module "axios" {}

export interface ApiResponse<T = any> {
  message: string;
  statusCode: number;
  isSuccess: boolean;
  data: T | null;
}
