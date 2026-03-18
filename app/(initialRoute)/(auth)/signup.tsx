import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { theme } from "@/utils/designSystem";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Checkbox, Text, View } from "react-native-ui-lib";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    address: "",
    title: "",
    companyName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { role } = useLocalSearchParams();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    if (!isAgreed) return;
    const { confirmPassword, ...registrationData } = formData;
    router.navigate(`/Otp?scrn=signup&role=${role}`);
  };

  const inputFieldStyle = {
    backgroundColor: "#1E1E1E",
    height: verticalScale(45),
    borderRadius: moderateScale(15),
  };

  const inputLabelStyle = {
    color: "#fff",
  };

  const isCustomer = typeof role === "string" && role === "customer";
  const roleLabel =
    (typeof role === "string" && role === "provider"
      ? "Brand Ambassador"
      : isCustomer
        ? "Client Portal"
        : "Brand Ambassador");

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(40) }}
      >
        <BackButton />

        {/* Heading & Subheading */}
        <View marginB-24>
          <Text white bold large24 style={{ color: "#fff" }}>
            Create Your Account
          </Text>
          <Text
            marginT-8
            small
            regular
            style={{ color: "#818898" }}
          >
            Lorem ipsum is simply dummy text of the printing and typesetting industry.
          </Text>
        </View>

        {/* Role / Brand label */}
        <Text semibold small style={{ color: theme.color.primary, marginBottom: 16 }}>
          {roleLabel}
        </Text>

        {/* First & Last Name in a row */}
        <View row gap-12 marginB-16>
          <View flex>
            <Input
              label="First Name"
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(t) => handleInputChange("firstName", t)}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
            />
          </View>
          <View flex>
            <Input
              label="Last Name"
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(t) => handleInputChange("lastName", t)}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
            />
          </View>
        </View>

        {isCustomer && (
          <>
            {/* Title */}
            <Input
              label="Title"
              placeholder="Enter your title"
              value={formData.title}
              onChangeText={(t) => handleInputChange("title", t)}
              marginB-16
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
            />

            {/* Company Name */}
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChangeText={(t) => handleInputChange("companyName", t)}
              marginB-16
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
            />
          </>
        )}

        {/* Email */}
        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(t) => handleInputChange("email", t)}
          keyboardType="email-address"
          autoCapitalize="none"
          marginB-16
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          placeholder="+1   Enter your number"
          value={formData.phone}
          onChangeText={(t) => handleInputChange("phone", t)}
          keyboardType="phone-pad"
          marginB-16
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        {/* Date of Birth (temporarily disabled, will be used later) */}
        {/*
        <Input
          label="Date of Birth"
          placeholder="dd/mm/yyyy"
          value={formData.dob}
          onChangeText={(t) => handleInputChange("dob", t)}
          marginB-16
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <Icon
              vector="Ionicons"
              name="calendar-clear-outline"
              size={18}
              color="#818898"
            />
          }
        />
        */}

        {/* Full Address - provider only */}
        {!isCustomer && (
          <Input
            label="Full Address"
            placeholder="Street, City, State, zip code"
            value={formData.address}
            onChangeText={(t) => handleInputChange("address", t)}
            marginB-16
            labelProps={{ style: inputLabelStyle } as any}
            fieldStyle={inputFieldStyle}
            placeholderTextColor="#818898"
            style={{ color: "#fff" }}
          />
        )}

        {/* Password */}
        <Input
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(t) => handleInputChange("password", t)}
          secureTextEntry={!showPassword}
          marginB-16
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

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          placeholder="Enter your password"
          value={formData.confirmPassword}
          onChangeText={(t) => handleInputChange("confirmPassword", t)}
          secureTextEntry={!showConfirmPassword}
          marginB-24
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

        {/* Terms & Privacy */}
        <View row marginB-24 paddingR-20 gap-10>
          <Checkbox
            value={isAgreed}
            onValueChange={setIsAgreed}
            color={theme.color.primary}
            size={20}
            borderRadius={5}
          />
          <Text small regular style={{ color: "#818898", flex: 1 }}>
            I’ve read and agreed to{" "}
            <Text small semibold style={{ color: theme.color.primary }}>
              User Agreement
            </Text>
            <Text small regular style={{ color: "#818898" }}>
              {" "}
              and{" "}
            </Text>
            <Text small semibold style={{ color: theme.color.primary }}>
              Privacy Policy
            </Text>
          </Text>
        </View>

        {/* Continue Button */}
        <CustomButton
          label="Continue"
          onPress={handleSignup}
          disabled={!isAgreed}
        />

        {/* Footer */}
        <TouchableOpacity onPress={() => router.back()}>
          <View row center marginT-24>
            <Text small regular style={{ color: "#818898" }}>
              Already have an account?{" "}
            </Text>
            <Text small semibold style={{ color: theme.color.primary }}>
              Sign In
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default Signup;
