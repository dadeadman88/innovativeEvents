import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { verticalScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (email) {
      router.push({
        pathname: "/Otp",
        params: { email, scrn: "forgotPassword" },
      });
    }
  };

  const inputFieldStyle = {
    backgroundColor: "#1E1E1E",
    height: verticalScale(45),
    borderRadius: 15,
  };

  const inputLabelStyle = {
    color: "#fff",
  };

  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      containerProps={{
        style: {
          paddingTop: 16,
          paddingHorizontal: "6%",
          paddingBottom: "4%",
        },
      }}
    >
      <BackButton />

      {/* Title & Subtitle */}
      <View paddingB-24>
        <Text white bold large24 style={{ color: "#fff" }}>
          Forgot Password
        </Text>
        <Text
          marginT-8
          small
          regular
          style={{ color: "#818898" }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        </Text>
      </View>

      {/* Input Section */}
      <View width="100%" marginT-10>
        <Input
          label="Email"
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />
      </View>

      {/* Send OTP Button */}
      <View width="100%" marginT-40>
        <CustomButton
          label="Send OTP"
          onPress={handleContinue}
          disabled={!email || !isValidEmail(email)}
        />
      </View>
    </Container>
  );
};

export default ForgotPassword;
