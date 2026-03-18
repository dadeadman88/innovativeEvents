import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { router } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = () => {
    if (password && password === confirmPassword) {
      router.replace("/login");
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
          Create a New Password
        </Text>
        <Text
          marginT-8
          small
          regular
          style={{ color: "#818898" }}
        >
          Enter your new password
        </Text>
      </View>

      {/* Input Section */}
      <View width="100%" marginT-10>
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          marginB-20
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                vector="MaterialCommunityIcons"
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#818898"
              />
            </TouchableOpacity>
          }
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                vector="MaterialCommunityIcons"
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#818898"
              />
            </TouchableOpacity>
          }
        />
      </View>

      {/* Continue Button */}
      <View width="100%" marginT-40>
        <CustomButton
          label="Continue"
          onPress={handleContinue}
          disabled={!password || password !== confirmPassword}
        />
      </View>
    </Container>
  );
};

export default CreatePassword;
