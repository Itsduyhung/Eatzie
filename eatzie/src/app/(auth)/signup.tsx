import { useState } from "react";
import { Image, TouchableOpacity, TextInput } from "react-native";
import { Formik } from "formik";
import Toast from "react-native-root-toast";
import { YStack, SizableText } from "tamagui";
import { Eye, EyeOff } from '@tamagui/lucide-icons';

import { CustomInputBase } from "@/components/ui/CustomInputBase";
import { registerAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constants";
import { RegisterSchema } from "@/utils/validate.schema";
import { ThemedScreen } from '@/components/layout/ThemedScreen';

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
      <YStack flex={1} backgroundColor="#F8FAFC" padding={24} justifyContent="center">
        {/* Logo Eatzie */}
        <Image
          source={require('@/assets/icons/eatzie.png')}
          style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 16, marginTop: 16 }}
          resizeMode="contain"
        />
        <Formik
          validationSchema={RegisterSchema}
          initialValues={{ fullName: "", email: "", password: "", confirmPassword: "" }}
          onSubmit={(values) =>
            handleSignUp(values.fullName, values.email, values.password)
          }
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <YStack gap={18}>
              <CustomInputBase
                value={values.fullName}
                showError={!!touched.fullName && !!errors.fullName}
                errorMessage={errors.fullName && 'Vui lòng nhập tên người dùng'}
                backgroundColor="#E9EEF4"
                height={48}
              >
                <TextInput
                  value={values.fullName}
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  style={{ flex: 1, fontSize: 16, color: "#222", height: 48, paddingHorizontal: 8 }}
                  placeholder="Tên người dùng"
                  placeholderTextColor="#888"
                />
              </CustomInputBase>
              <CustomInputBase
                value={values.email}
                showError={!!touched.email && !!errors.email}
                errorMessage={errors.email && 'Vui lòng nhập email'}
                backgroundColor="#E9EEF4"
                height={48}
              >
                <TextInput
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  style={{ flex: 1, fontSize: 16, color: "#222", height: 48, paddingHorizontal: 8 }}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </CustomInputBase>
              <CustomInputBase
                value={values.password}
                showError={!!touched.password && !!errors.password}
                errorMessage={errors.password && 'Vui lòng nhập mật khẩu'}
                backgroundColor="#E9EEF4"
                suffixIcon={
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </TouchableOpacity>
                }
                height={48}
              >
                <TextInput
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  style={{ flex: 1, fontSize: 16, color: "#222", height: 48, paddingHorizontal: 8 }}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#888"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </CustomInputBase>
              <CustomInputBase
                value={values.confirmPassword}
                showError={!!touched.confirmPassword && !!errors.confirmPassword}
                errorMessage={errors.confirmPassword && 'Vui lòng nhập lại mật khẩu'}
                backgroundColor="#E9EEF4"
                suffixIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </TouchableOpacity>
                }
                height={48}
              >
                <TextInput
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  style={{ flex: 1, fontSize: 16, color: "#222", height: 48, paddingHorizontal: 8 }}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#888"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
              </CustomInputBase>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6666FF',
                  borderRadius: 10,
                  paddingVertical: 16,
                  alignItems: 'center',
                  marginTop: 8,
                }}
                onPress={() => handleSubmit()}
                disabled={isLoading}
              >
                <SizableText color="#fff" fontWeight="600" fontSize={18}>
                  {isLoading ? 'Đang đăng kí...' : 'Đăng kí'}
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
