import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { AuthActions } from "@/redux/actions/AuthActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { AppDispatch } from "@/redux/store";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { Text, ToastPresets, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";

const CreatePassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  const params = useLocalSearchParams<{ email?: string | string[] }>();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = async () => {
    if (!email) {
      Toaster({
        visible: true,
        message: "Email is missing. Please retry forgot password.",
        preset: ToastPresets.FAILURE,
      });
      return;
    }

    if (password.length < 8) {
      Toaster({
        visible: true,
        message: "Please enter more than 8 characters for password",
        preset: ToastPresets.FAILURE,
      });
      return;
    }

    if (!password || password !== confirmPassword) return;

    try {
      await dispatch(
        AuthActions.ResetPassword({
          email,
          new_password: password,
        })
      ).unwrap();

      Toaster({
        visible: true,
        message: "Password successfully updated",
        preset: ToastPresets.SUCCESS,
      });
      router.replace("/login");
    } catch {
      // Errors are handled by AxiosInterceptor global toast
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
