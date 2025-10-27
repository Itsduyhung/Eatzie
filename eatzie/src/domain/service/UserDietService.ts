import { get, putRaw } from "@/infrastructure/api/axiosClient";
import { ApiResponse } from "@/types/axios";
import { UserDiet, UserDietUpdateRequest } from "@/types/userDiet.types";

export class UserDietService {
  /**
   * Lấy thông tin hồ sơ vị giác của user
   * @param userId - ID của user
   * @returns Promise<UserDiet | null>
   */
  static async getUserDiet(userId: number): Promise<UserDiet | null> {
    try {
      console.log(`🔍 Calling GET /UserDiet/${userId}`);
      const response = await get<ApiResponse<UserDiet>>(`/UserDiet/${userId}`);
      console.log("✅ UserDietService.getUserDiet API Response:", response);

      if (response.isSuccess && response.data) {
        console.log(
          "✅ UserDietService.getUserDiet: Data found:",
          response.data
        );
        return response.data;
      }

      console.log(
        "⚠️ UserDietService.getUserDiet: API call not successful or no data.",
        response
      );
      return null;
    } catch (error) {
      console.error("❌ Error getting user diet:", error);
      return null;
    }
  }

  /**
   * Cập nhật thông tin hồ sơ vị giác của user
   * @param updateData - Dữ liệu cập nhật
   * @returns Promise<ApiResponse<any>>
   */
  static async updateUserDiet(
    updateData: UserDietUpdateRequest
  ): Promise<ApiResponse<any>> {
    try {
      const response = await putRaw<any>("/UserDiet/update-full", updateData);
      console.log("✅ Update user diet response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating user diet:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin thức ăn dị ứng
   * @param userId - ID của user
   * @param allergicFood - Danh sách thức ăn dị ứng
   * @returns Promise<ApiResponse<any>>
   */
  static async updateAllergicFood(
    userId: number,
    allergicFood: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await putRaw<any>("/UserDiet/allergic-food", {
        userId,
        allergicFood,
      });
      console.log("✅ Update allergic food response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating allergic food:", error);
      throw error;
    }
  }

  /**
   * Cập nhật thông tin thức ăn yêu thích
   * @param userId - ID của user
   * @param favoriteFood - Danh sách thức ăn yêu thích
   * @returns Promise<ApiResponse<any>>
   */
  static async updateFavoriteFood(
    userId: number,
    favoriteFood: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await putRaw<any>("/UserDiet/favorite-food", {
        userId,
        favoriteFood,
      });
      console.log("✅ Update favorite food response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating favorite food:", error);
      throw error;
    }
  }

  /**
   * Cập nhật khoảng chi tiêu
   * @param userId - ID của user
   * @param minSpending - Chi tiêu tối thiểu
   * @param maxSpending - Chi tiêu tối đa
   * @returns Promise<ApiResponse<any>>
   */
  static async updateSpendingRange(
    userId: number,
    minSpending: number,
    maxSpending: number
  ): Promise<ApiResponse<any>> {
    try {
      const response = await putRaw<any>("/UserDiet/spending-range", {
        userId,
        minSpending,
        maxSpending,
      });
      console.log("✅ Update spending range response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating spending range:", error);
      throw error;
    }
  }
}
