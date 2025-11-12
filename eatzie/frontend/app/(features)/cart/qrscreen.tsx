import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { OrderService } from "@/domain/service/OrderService";
import { PaymentService } from "@/domain/service/PaymentService";
import { ThemedText } from "@/hooks/ThemedTextColor";
import { formatCurrency } from "@/utils/formatCurrency";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Separator, XStack, YStack } from "tamagui";

export default function QrScreen() {
  const { total, orderId, paymentCode, paymentLink, qrCode } =
    useLocalSearchParams();
  const router = useRouter();
  const totalNumber = Number(total || 0);
  const displayOrderId = orderId || Math.floor(Math.random() * 100000000000000);

  // Normalize qrCode to string (useLocalSearchParams can return string | string[])
  const qrCodeString = Array.isArray(qrCode)
    ? qrCode[0]
    : (qrCode as string | undefined);

  // Kiểm tra format của qrCode
  // PayOS có thể trả về:
  // 1. Base64 image: "data:image/png;base64,..."
  // 2. URL: "https://..."
  // 3. Raw QR data string: "00020101021238570010A000000727..."
  const isBase64Image = qrCodeString?.startsWith("data:image");
  const isUrl =
    qrCodeString?.startsWith("http://") || qrCodeString?.startsWith("https://");
  const isRawQRData = qrCodeString && !isBase64Image && !isUrl;

  // Debug: Log qrCode để kiểm tra
  useEffect(() => {
    if (qrCodeString) {
      console.log(
        "📱 QR Code received:",
        qrCodeString.substring(0, 50) + "..."
      );
      console.log("📱 QR Code format:", {
        isBase64Image,
        isUrl,
        isRawQRData,
        length: qrCodeString.length,
      });
    } else {
      console.log("⚠️ No QR code from PayOS, will generate from paymentLink");
    }
  }, [qrCodeString, isBase64Image, isUrl, isRawQRData]);

  const [isPolling, setIsPolling] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [orderDescription, setOrderDescription] = useState<string>("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Fetch order details to get description
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        const orderResponse = await OrderService.getOrderById(Number(orderId));
        const orderData = (orderResponse as any).data || orderResponse;

        if (orderData) {
          // Get description from order items or create from order info
          if (orderData.items && orderData.items.length > 0) {
            const itemsDescription = orderData.items
              .map(
                (item: any) =>
                  `${item.foodName || `Món ${item.foodId}`} x${item.quantity}`
              )
              .join(", ");
            setOrderDescription(itemsDescription);
            setOrderItems(orderData.items);
          } else {
            setOrderDescription(`Đơn hàng #${displayOrderId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setOrderDescription(`Đơn hàng #${displayOrderId}`);
      }
    };

    fetchOrderDetails();
  }, [orderId, displayOrderId]);

  // Check payment status by polling order status
  const checkPaymentStatus = async () => {
    if (!orderId || isNavigatingRef.current || isChecking) return;

    setIsChecking(true);

    try {
      // Method 1: Check order status
      // Backend returns OrderResponse directly (not wrapped in ApiResponse)
      const orderResponse = await OrderService.getOrderById(Number(orderId));

      // Handle both wrapped and unwrapped responses
      const orderData = (orderResponse as any).data || orderResponse;

      if (orderData && orderData.status) {
        const status = orderData.status;

        // If order is paid, navigate to success screen
        if (
          status === "Đã thanh toán" ||
          status === "PAID" ||
          status === "paid"
        ) {
          console.log("✅ Payment successful! Order status:", status);
          setIsPolling(false);

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          // Navigate to success screen
          isNavigatingRef.current = true;
          router.replace({
            pathname: "/(features)/cart/paymentsuccess",
            params: {
              orderId: String(orderId),
              total: String(total),
            },
          });
          return;
        }

        console.log("⏳ Payment pending. Order status:", status);
      }

      // Method 2: Also verify payment directly using orderId
      if (orderId) {
        try {
          const paymentResponse = await PaymentService.verifyPaymentByOrder(
            Number(orderId)
          );

          // Handle both wrapped and unwrapped responses
          const paymentData = (paymentResponse as any).data || paymentResponse;

          if (paymentData?.status === "PAID") {
            console.log(
              "✅ Payment verified via PaymentService.verifyPaymentByOrder!"
            );
            setIsPolling(false);

            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Navigate to success screen
            isNavigatingRef.current = true;
            router.replace({
              pathname: "/(features)/cart/paymentsuccess",
              params: {
                orderId: String(orderId),
                total: String(total),
              },
            });
            return;
          }
        } catch (paymentErr) {
          // Payment verification failed, continue with order status check
          console.log(
            "Payment verification failed, continuing with order status check"
          );
        }
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      // Continue polling even on error
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      console.warn("⚠️ No orderId provided, skipping payment polling");
      return;
    }

    console.log("🚀 Starting payment status polling for order:", orderId);

    // Start polling immediately (with small delay to ensure component is mounted)
    const initialTimeout = setTimeout(() => {
      checkPaymentStatus();
    }, 500);

    // Set up polling interval (check every 3 seconds)
    pollingIntervalRef.current = setInterval(() => {
      if (!isNavigatingRef.current && !isChecking) {
        checkPaymentStatus();
      }
    }, 3000);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <ScrollScreenLayout headerLeftIcons={[<BackButton key="back" />]}>
      <YStack flex={1} gap="$4" paddingHorizontal="$4" paddingBottom="$4">
        <XStack>
          <BackButton />
        </XStack>

        <YStack flex={1} justifyContent="center" alignItems="center" gap="$3">
          {/* Payment info */}
          <YStack alignItems="center" gap="$2" marginBottom="$2">
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#333",
              }}
            >
              Thanh toán đơn hàng #{displayOrderId}
            </ThemedText>

            {/* Description */}
            {orderDescription && (
              <YStack paddingHorizontal="$4" width="100%">
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  {orderDescription}
                </ThemedText>
              </YStack>
            )}

            {/* Amount */}
            <XStack alignItems="flex-end" gap="$2" marginTop="$1">
              <ThemedText
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#6666FF",
                }}
              >
                {formatCurrency(totalNumber)}
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  color: "#666",
                }}
              >
                VNĐ
              </ThemedText>
            </XStack>
          </YStack>

          {/* QR Code from PayOS API response or generated from paymentLink */}
          <YStack
            alignItems="center"
            gap="$2"
            padding="$4"
            backgroundColor="white"
            borderRadius={16}
          >
            {qrCodeString && qrCodeString.trim() !== "" ? (
              // PayOS trả về QR code - xử lý theo format
              isBase64Image || isUrl ? (
                // Nếu là base64 image hoặc URL, hiển thị bằng Image component
                <Image
                  source={{ uri: qrCodeString }}
                  style={{ width: 220, height: 220 }}
                  resizeMode="contain"
                  onError={(error) => {
                    console.error(
                      "Error loading QR code image from PayOS:",
                      error
                    );
                  }}
                />
              ) : isRawQRData ? (
                // Nếu là raw QR data string, tạo QR code từ string đó
                <QRCode
                  value={qrCodeString}
                  size={220}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                  logoSize={0}
                  logoMargin={0}
                  logoBorderRadius={0}
                  logoBackgroundColor="transparent"
                />
              ) : null
            ) : paymentLink ? (
              // Fallback: Tạo QR code từ paymentLink nếu PayOS không trả về qrCode
              <QRCode
                value={paymentLink as string}
                size={220}
                color="#000000"
                backgroundColor="#FFFFFF"
                logoSize={0}
                logoMargin={0}
                logoBorderRadius={0}
                logoBackgroundColor="transparent"
              />
            ) : (
              <View
                style={{
                  width: 220,
                  height: 220,
                  backgroundColor: "#f0f0f0",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                }}
              >
                <ActivityIndicator size="large" color="#6666FF" />
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#999",
                    marginTop: 8,
                  }}
                >
                  Đang tải QR code...
                </ThemedText>
              </View>
            )}

            {/* Amount displayed below QR */}
            <YStack alignItems="center" gap="$1" marginTop="$2">
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#999",
                }}
              >
                Số tiền thanh toán
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#6666FF",
                }}
              >
                {formatCurrency(totalNumber)} VNĐ
              </ThemedText>
            </YStack>
          </YStack>

          <ThemedText
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#007AFF",
              marginTop: 8,
            }}
          >
            Quét mã để thanh toán
          </ThemedText>

          {isPolling && (
            <YStack alignItems="center" gap="$2" marginTop="$4">
              <ActivityIndicator size="small" color="#6666FF" />
              <ThemedText
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#666",
                }}
              >
                Đang chờ thanh toán...
              </ThemedText>
            </YStack>
          )}
        </YStack>

        <Separator marginBottom="$2" />
      </YStack>
    </ScrollScreenLayout>
  );
}
