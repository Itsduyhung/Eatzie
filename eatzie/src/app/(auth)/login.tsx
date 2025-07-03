import { Formik } from "formik";
import { useState } from "react";
import Toast from "react-native-root-toast";
import { Spinner, YStack } from "tamagui";
import * as Yup from "yup";

import { FormErrorContext } from "@/app/hooks/FormErrorContext";
import {
  FormikInput,
  FormikPasswordInput,
} from "@/components/formik/FormikFields";
import { ThemedScreen } from "@/components/layout/ThemedScreen";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";

import { useAuth } from "@/applicaton/hooks/useAuth";
import { useRouter } from "expo-router";

export default function LoginScreen() {
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
      console.log(" Login success:", result);

      Toast.show("Đăng nhập thành công", { duration: 2000 });

      router.replace("/");
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      Toast.show(err?.message ?? "Đăng nhập thất bại", { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedScreen backgroundColor="#ffffff">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <FormErrorContext.Provider
            value={{ showError: formik.submitCount > 0 }}
          >
            <YStack
              f={1}
              p="$4"
              paddingBottom="$10"
              gap="$4"
              justifyContent="center"
              backgroundColor="white"
            >
              <FormikInput
                name="email"
                placeholder="Số điện thoại hoặc email"
                keyboardType="email-address"
                autoCapitalize="none"
                backgroundColor="transparent"
              />

              <FormikPasswordInput
                name="password"
                placeholder="Mật khẩu"
                autoCapitalize="none"
                backgroundColor="transparent"
              />

              <CustomButton
                backgroundColor="black"
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
    </ThemedScreen>
  );
}
