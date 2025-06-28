import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import Toast from "react-native-root-toast";

import { Button, Input, SizableText, YStack, useTheme } from "tamagui";

import QuestionButton from "@/components/button/question.button";
import SocialButton from "@/components/button/social.button";
import { registerAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constants";
import { RegisterSchema } from "@/utils/validate.schema";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleSignUp = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const res = await registerAPI(fullName, email, password);
      if (res.data) {
        router.replace({
          pathname: "/(auth)/verify",
          params: { email },
        });
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
    <YStack flex={1} padding="$4" gap="$4">
      <SizableText fontSize="$8" fontWeight="700" marginVertical="$6">
        Register Now
      </SizableText>

      <Formik
        validationSchema={RegisterSchema}
        initialValues={{ fullName: "", email: "", password: "" }}
        onSubmit={(values) =>
          handleSignUp(values.fullName, values.email, values.password)
        }
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <YStack gap="$3">
            <Input
              placeholder="Full Name"
              onChangeText={handleChange("fullName")}
              onBlur={handleBlur("fullName")}
              value={values.fullName}
            />
            {errors.fullName && (
              <SizableText color="red">{errors.fullName}</SizableText>
            )}

            <Input
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {errors.email && (
              <SizableText color="red">{errors.email}</SizableText>
            )}

            <Input
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {errors.password && (
              <SizableText color="red">{errors.password}</SizableText>
            )}

            <Button
              size="$5"
              backgroundColor={APP_COLOR.ORANGE}
              color="white"
              borderRadius="$10"
              onPress={handleSubmit as any}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </YStack>
        )}
      </Formik>

      <QuestionButton
        questionText="Already have an account?"
        questionBtnName="Sign in"
        path="/(auth)/login"
      />

      <SocialButton title="Sign up with" textColor="black" />
    </YStack>
  );
};

export default SignUpPage;
