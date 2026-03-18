import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { theme } from "@/utils/designSystem";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

interface LoginProps {}

const Login = (props: LoginProps) => {
  const [credentials, setCredentials] = React.useState({
    email: __DEV__ ? "johnsmith@yopmail.com" : "",
    password: __DEV__ ? "12345678" : "",
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const { role } = useLocalSearchParams();

  const inputFieldStyle = {
    backgroundColor: "#1E1E1E",
    height: verticalScale(45),
    borderRadius: moderateScale(15)
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
      {/* Welcome Section */}
      <View paddingT-40 paddingB-32>
        <Text white bold large26 style={{ color: "#fff" }}>
          Welcome Back! 👋
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

      {/* Input Fields */}
      <Input
        label="Email"
        placeholder="Enter your email address"
        value={credentials.email}
        onChangeText={(t) => {
          const processedText =
            t.length > 0 ? t.charAt(0).toLowerCase() + t.slice(1) : t;
          setCredentials((prev) => ({ ...prev, email: processedText }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        labelProps={{ style: inputLabelStyle } as any}
        fieldStyle={inputFieldStyle}
        placeholderTextColor="#818898"
        style={{ color: "#fff" }}
      />

      <Input
        marginT-20
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={!showPassword}
        value={credentials.password}
        onChangeText={(t) =>
          setCredentials((prev) => ({ ...prev, password: t }))
        }
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

      {/* Forgot Password */}
      <TouchableOpacity
        marginT-15
        marginB-24
        style={{ alignSelf: "flex-end" }}
        onPress={() => router.push("/forgotPassword")}
      >
        <Text small medium style={{ color: theme.color.primary }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <CustomButton
        label="Sign In"
        onPress={() =>
          router.push({
            pathname: "/Otp",
            params: {
              role,
              scrn: "login",
            },
          })
        }
      />

      {/* Divider
      <View row centerV marginV-24>
        <View flex height={1} style={{ backgroundColor: "#3A3A3A" }} />
        <Text marginH-16 extraSmall regular style={{ color: "#818898" }}>
          Or continue with
        </Text>
        <View flex height={1} style={{ backgroundColor: "#3A3A3A" }} />
      </View>
      */}
      

      {/* Social Login Buttons
      <View row centerH gap-16>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            width: moderateScale(56),
            height: moderateScale(56)
          }}
        >
          <Image
            source={require("../../../assets/images/google.png")}
            style={{ width: moderateScale(56), height: moderateScale(56) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {Platform.OS === "ios" && (
          <TouchableOpacity
            onPress={() => {}}
            style={{
              width: moderateScale(56),
              height: moderateScale(56),
            }}
          >
            <Image
              source={require("../../../assets/images/apple.png")}
              style={{ width: moderateScale(56), height: moderateScale(56) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {}}
          style={{
            width: moderateScale(56),
            height: moderateScale(56),
          }}
        >
          <Image
            source={require("../../../assets/images/fb.png")}
            style={{ width: moderateScale(56), height: moderateScale(56) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      */}
      

      {/* Sign Up Link */}
      <TouchableOpacity
        onPress={() => router.navigate(`/signup?role=${role}`)}
        style={{ alignSelf: "center", marginTop: 50 }}
      >
        <View row center>
          <Text small regular style={{ color: "#818898" }}>
            Don't have an account?{" "}
          </Text>
          <Text small semibold style={{ color: theme.color.primary }}>
            Sign Up
          </Text>
        </View>
      </TouchableOpacity>
    </Container>
  );
};

export default Login;
