import { Formik } from "formik";
import { useState } from "react";
import Toast from "react-native-root-toast";
import { Spinner, XStack, YStack } from "tamagui";
import * as Yup from "yup";
import { Image } from 'react-native';

import { FormErrorContext } from "@/app/hooks/FormErrorContext";
import {
  FormikInput,
  FormikPasswordInput,
} from "@/components/formik/FormikFields";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";

import { useAuth } from "@/applicaton/hooks/useAuth";
import { ScrollScreenLayout } from "@/components/layout/ScrollScreenLayout";
import { BackButton } from "@/components/ui/BackButton";
import { storage } from "@/infrastructure/storage/tokenStorage";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    password: Yup.string()
      .min(6, "Tối thiểu 6 ký tự")
      .required("Vui lòng nhập mật khẩu"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    console.log("🟡 Submitting form with:", values);

    try {
      const result = await login(values);
      console.log(" Login success:", result.token);
      await storage.setItem("token", result.token);
      console.log("Save token sucessfull");

      Toast.show("Đăng nhập thành công", { duration: 2000 });

      router.navigate("/(features)/survey/multistepsurvey");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      Toast.show(err?.message ?? "Đăng nhập thất bại", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollScreenLayout centerContent={true}>
      <YStack f={1}>
        <XStack position="absolute" top={insets.top + 8} left="$1">
          <BackButton />
        </XStack>

        <YStack f={1} justifyContent="center" px="$4">
          <Image
            source={require('@/assets/icons/eatzie.png')}
            style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 16, marginTop: 16 }}
            resizeMode="contain"
          />
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <FormErrorContext.Provider
                value={{ showError: formik.submitCount > 0 }}
              >
                <YStack gap="$4">
                  <FormikInput
                    name="email"
                    label="Số điện thoại hoặc email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    backgroundColor="transparent"
                  />

                  <FormikPasswordInput
                    name="password"
                    label="Mật khẩu"
                    keyboardType="email-address"
                    // label="Số điện thoại hoặc email"
                    autoCapitalize="none"
                    backgroundColor="transparent"
                  />

                  <CustomButton
                    backgroundColor="#6666FF"
                    size="$5"
                    textfontsize="$4"
                    onPress={() => formik.handleSubmit()}
                  >
                    {loading ? <Spinner color="white" /> : "Đăng nhập"}
                  </CustomButton>

                  <CustomText size="$2" textAlign="center">
                    Bạn quên mật khẩu ư?
                  </CustomText>
                </YStack>
              </FormErrorContext.Provider>
            )}
          </Formik>
        </YStack>
      </YStack>
    </ScrollScreenLayout>
  );
}
