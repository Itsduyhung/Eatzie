import { HeaderSetting } from "@/components/home/HeaderSetting";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { CustomButton } from "@/components/ui/CustomButton";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, XStack, YStack, Separator } from "tamagui";

const TasteProfile = () => {
  const router = useRouter();

  // Fake data cho hồ sơ vị giác
  const tasteProfileData = {
    dietType: "Cả hai", // Chay, Mặn, Cả hai
    allergies: [
      "Đậu phộng",
      "Hải sản",
      "Sữa",
      "Trứng"
    ],
    preferences: [
      "Món cay",
      "Món nướng",
      "Món chay",
      "Món truyền thống Việt Nam"
    ],
    budgetRange: {
      min: 50000,
      max: 200000
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <ScrollScreenLayout
      header={<HeaderSetting nameTitle="Hồ sơ vị giác" />}
      headerBackgroundColor="white"
    >
      <YStack backgroundColor="#F5F5F5" flex={1} padding="$4">
        
        {/* Chế độ ăn */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4">
          <XStack alignItems="center" marginBottom="$3">
            <MaterialCommunityIcons name="food-fork-drink" size={24} color="#8B5CF6" />
            <Text fontSize="$6" fontWeight="bold" marginLeft="$2" color="#333">
              Chế độ ăn
            </Text>
          </XStack>
          <Text fontSize="$5" color="#666" marginLeft="$6">
            {tasteProfileData.dietType}
          </Text>
        </YStack>

        {/* Dị ứng */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4">
          <XStack alignItems="center" marginBottom="$3">
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#8B5CF6" />
            <Text fontSize="$6" fontWeight="bold" marginLeft="$2" color="#333">
              Dị ứng
            </Text>
          </XStack>
          <YStack marginLeft="$6">
            {tasteProfileData.allergies.map((allergy, index) => (
              <Text key={index} fontSize="$5" color="#666" marginBottom="$1">
                • {allergy}
              </Text>
            ))}
          </YStack>
        </YStack>

        {/* Sở thích */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4">
          <XStack alignItems="center" marginBottom="$3">
            <MaterialCommunityIcons name="heart-outline" size={24} color="#8B5CF6" />
            <Text fontSize="$6" fontWeight="bold" marginLeft="$2" color="#333">
              Sở thích
            </Text>
          </XStack>
          <YStack marginLeft="$6">
            {tasteProfileData.preferences.map((preference, index) => (
              <Text key={index} fontSize="$5" color="#666" marginBottom="$1">
                • {preference}
              </Text>
            ))}
          </YStack>
        </YStack>

        {/* Tiền chi tiêu */}
        <YStack backgroundColor="white" borderRadius="$4" padding="$4" marginBottom="$4">
          <XStack alignItems="center" marginBottom="$3">
            <MaterialCommunityIcons name="currency-usd" size={24} color="#8B5CF6" />
            <Text fontSize="$6" fontWeight="bold" marginLeft="$2" color="#333">
              Tiền chi tiêu
            </Text>
          </XStack>
          <YStack marginLeft="$6">
            <Text fontSize="$5" color="#666" marginBottom="$2">
              Tối thiểu: {formatCurrency(tasteProfileData.budgetRange.min)}
            </Text>
            <Text fontSize="$5" color="#666">
              Tối đa: {formatCurrency(tasteProfileData.budgetRange.max)}
            </Text>
          </YStack>
        </YStack>

        {/* Nút chỉnh sửa */}
        <CustomButton
          backgroundColor="#8B5CF6"
          onPress={() => {
            // Có thể thêm logic chỉnh sửa sau
            console.log("Chỉnh sửa hồ sơ vị giác");
          }}
          paddingVertical="$3"
          marginTop="$4"
        >
          <Text color="white" fontSize="$5" fontWeight="bold">
            Chỉnh sửa hồ sơ
          </Text>
        </CustomButton>

      </YStack>
    </ScrollScreenLayout>
  );
};

export default TasteProfile; 