import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { AuthActions } from "@/redux/actions/AuthActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { AppDispatch } from "@/redux/store";
import { getMainRouteForRole } from "@/utils/authNavigation";
import client from "@/utils/AxiosInterceptor";
import { theme } from "@/utils/designSystem";
import { authEndpoints } from "@/utils/Endpoints";
import { type Href, router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Checkbox, Text, ToastPresets, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/OtherSlice";

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
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
  const { role } = useLocalSearchParams<{ role?: "customer" | "provider" }>();
  const [didSubmit, setDidSubmit] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showValidationToast = (message: string) => {
    Toaster({
      visible: true,
      message,
      preset: ToastPresets.FAILURE,
    });
  };

  const firstName = formData.firstName.trim();
  const lastName = formData.lastName.trim();
  const email = formData.email.trim();
  const title = formData.title.trim();
  const companyName = formData.companyName.trim();
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  const isEmailValid = /^\S+@\S+\.\S+$/.test(email);

  const handleSignup = () => {
    setDidSubmit(true);

    if (!isAgreed) return showValidationToast("Please accept the privacy policy to continue");

    if (!firstName) return showValidationToast("First name is required");
    if (!lastName) return showValidationToast("Last name is required");

    const normalizedRole = Array.isArray(role) ? role[0] : role;
    const customerFlow = normalizedRole !== "provider";
    if (customerFlow) {
      if (!title) return showValidationToast("Title is required");
      if (!companyName) return showValidationToast("Company name is required");
    }

    if (!email) return showValidationToast("Email is required");
    if (!isEmailValid) return showValidationToast("Please enter a valid email");

    if (!password) return showValidationToast("Password is required");
    if (!confirmPassword) return showValidationToast("Confirm password is required");
    if (password !== confirmPassword) return showValidationToast("Passwords do not match");

    if (password.length < 8) {
      return showValidationToast("Password must be at least 8 characters");
    }

    const backendRole = normalizedRole === "provider" ? "contractor" : "user";

    // Provider flow: only check email, then continue to verification step.
    if (normalizedRole === "provider") {
      dispatch(setLoading(true));
      client
        .post(authEndpoints.checkEmail, { email })
        .then(({ data }) => {
          // For this endpoint, a 200/success response means the email already exists.
          showValidationToast("Please use a different email address");
        })
        .catch((err: any) => {
          // API behavior:
          // - 401 + "Email does not exist!" => email is available (continue)
          // - 200/success => email exists (handled above)
          const status = err?.response?.status;
          const apiMessages =
            err?.response?.data?.error?.messages ??
            err?.response?.data?.messages ??
            err?.response?.data?.error?.message ??
            err?.response?.data?.message;
          const messages: string[] = Array.isArray(apiMessages)
            ? apiMessages.map((m: any) => String(m))
            : apiMessages != null
              ? [String(apiMessages)]
              : [];

          const emailDoesNotExist = messages.some((m) => m.toLowerCase().includes("does not exist"));
          if (status === 401 && emailDoesNotExist) {
            router.push({
              pathname: "/verifyProvider",
              params: {
                role: "provider",
                firstName,
                lastName,
                email,
                phone: formData.phone?.trim() ? formData.phone.trim() : undefined,
                address: formData.address?.trim() ? formData.address.trim() : undefined,
                password,
              },
            });
            return;
          }

          // Other errors: handled by AxiosInterceptor global toast
        });
      return;
    }

    dispatch(
      AuthActions.Register({
        role: backendRole,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        mobile_number: formData.phone?.trim() ? formData.phone.trim() : undefined,
        title: customerFlow ? title : undefined,
        company: customerFlow ? companyName : undefined,
      })
    )
      .unwrap()
      .then((result) => {
        const verifyCode = (result as any)?.verify_code;
        router.replace({
          pathname: "/Otp",
          params: {
            scrn: "signup",
            role: normalizedRole ?? (result.user?.role as any),
            email,
            code: verifyCode != null ? String(verifyCode) : undefined,
          },
        });
      })
      .catch((err) => {
        if (typeof err === "string") {
          showValidationToast(err);
          return;
        }
        // 4xx/5xx: `error.messages` (e.g. 406 email taken) is shown in the global toast (AxiosInterceptor)
      });
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
  const isProvider = typeof role === "string" && role === "provider";
  const roleLabel =
    isProvider
      ? "Brand Ambassador"
      : isCustomer
        ? "Client Portal"
        : "Client Portal";

  const subtitleText = isProvider
    ? "Create your Brand Ambassador account to receive event requests, manage bookings, and get paid."
    : "Create your Client account to discover event services, book confidently, and manage your events in one place.";

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
            {subtitleText}
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
              onBlur={() => {
                if (!didSubmit) return;
                if (!title) showValidationToast("Title is required");
              }}
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
              onBlur={() => {
                if (!didSubmit) return;
                if (!companyName) showValidationToast("Company name is required");
              }}
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
          onBlur={() => {
            if (!didSubmit) return;
            if (!email) showValidationToast("Email is required");
            else if (!isEmailValid) showValidationToast("Please enter a valid email");
          }}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          placeholder="Enter your number (Optional)"
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
          textContentType="none"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          marginB-16
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          onBlur={() => {
            if (!didSubmit) return;
            if (!password) showValidationToast("Password is required");
            else if (password.length < 8) showValidationToast("Password must be at least 8 characters");
          }}
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
          textContentType="none"
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          marginB-24
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          onBlur={() => {
            if (!didSubmit) return;
            if (!confirmPassword) showValidationToast("Confirm password is required");
            else if (password && confirmPassword && password !== confirmPassword) {
              showValidationToast("Passwords do not match");
            }
          }}
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
          disabled={
            !isAgreed ||
            !firstName ||
            !lastName ||
            (isCustomer && (!title || !companyName)) ||
            !email ||
            !isEmailValid ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
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
