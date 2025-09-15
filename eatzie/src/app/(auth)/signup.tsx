import { Formik } from "formik";
import { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { SizableText, YStack } from "tamagui";

import {
  FormikInput,
  FormikPasswordInput,
} from "@/components/formik/FormikFields";
import { ThemedScreen } from "@/components/layout/ThemedScreen";
import { registerAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constants";
import { RegisterSchema } from "@/utils/validate.schema";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const res = await registerAPI(fullName, email, password);
      if (res.data) {
        // router.replace({
        //   pathname: "/(auth)/verify",
        //   params: { email },
        // });
      } else {
        const msg = Array.isArray(res.message) ? res.message[0] : res.message;
        Toast.show(msg, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedScreen>
      <YStack
        flex={1}
        backgroundColor="#F8FAFC"
        padding={24}
        justifyContent="center"
      >
        {/* Logo Eatzie */}
        <Image
          source={require("@/assets/icons/eatzie.png")}
          style={{
            width: 120,
            height: 120,
            alignSelf: "center",
            marginBottom: 16,
            marginTop: 16,
          }}
          resizeMode="contain"
        />
        <Formik
          validationSchema={RegisterSchema}
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) =>
            handleSignUp(values.fullName, values.email, values.password)
          }
        >
          {(formik) => (
            <YStack gap="$4">
              <FormikInput
                name="fullName"
                label="Tên người dùng"
                backgroundColor="#FFFFFF"
                autoCapitalize="words"
                paddingBottom={10}
              />
              <FormikInput
                name="email"
                label="Email"
                backgroundColor="#FFFFFF"
                keyboardType="email-address"
                autoCapitalize="none"
                paddingBottom={10}
              />
              <FormikPasswordInput
                name="password"
                label="Mật khẩu"
                placeholder="Mật khẩu"
                backgroundColor="#FFFFFF"
                autoCapitalize="none"
              />
              <FormikPasswordInput
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                placeholder="Nhập lại mật khẩu"
                backgroundColor="#FFFFFF"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#6666FF",
                  borderRadius: 10,
                  paddingVertical: 16,
                  alignItems: "center",
                  marginTop: 8,
                }}
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
              >
                <SizableText color="#fff" fontWeight="600" fontSize={18}>
                  {isLoading ? "Đang đăng kí..." : "Đăng kí"}
                </SizableText>
              </TouchableOpacity>
            </YStack>
          )}
        </Formik>
      </YStack>
    </ThemedScreen>
  );
};

export default SignUpPage;
