import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import SuccessDialog from "@/components/SuccessDialog";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Dialog, Image, Text, ToastPresets, TouchableOpacity, View } from "react-native-ui-lib";

const verficationBenefits = [
    "Receive a Verified Badge on your Profile",
    "Get higher searches!",
    "Receive less platform charges than ordinary profile",
    "Gain the trust of Provier by verifying your profile!"
]

const Otp = () => {
    const { Toaster } = useToast();
    const params = useLocalSearchParams<{
        email?: string | string[];
        code?: string | string[];
        role?: string | string[];
        scrn?: string | string[];
    }>();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [verificationDialogVisible, setVerificationDialogVisible] = useState(false);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const normalizedEmail = Array.isArray(params.email) ? params.email[0] : params.email ?? "example@gmail.com";
    const normalizedCode = Array.isArray(params.code) ? params.code[0] : params.code;
    const role = Array.isArray(params.role) ? params.role[0] : params.role;
    const scrn = Array.isArray(params.scrn) ? params.scrn[0] : params.scrn;

    useEffect(() => {
        if (!__DEV__ || scrn !== "login") return;

        const raw =
            typeof normalizedCode === "string"
                ? normalizedCode
                : normalizedCode == null
                    ? ""
                    : String(normalizedCode);
        const digits = raw.replace(/\D/g, "").slice(0, 4);
        if (digits.length === 4) setOtp(digits.split(""));
    }, [normalizedCode, scrn]);


    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
        // Auto-focus previous on backspace handled by Keyboard event usually
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleContinue = () => {
        const code = otp.join("");
        if (code.length === 4) {
            const expected = String(normalizedCode ?? "").replace(/\D/g, "").slice(0, 4);

            if (scrn == "forgotPassword") {
                if (expected && code === expected) {
                    Toaster({
                        visible: true,
                        message: "Verification successful",
                        preset: ToastPresets.SUCCESS,
                    });
                    router.push({ pathname: "/createPassword", params: { email: normalizedEmail } });
                    return;
                }

                Toaster({
                    visible: true,
                    message: "Invalid code. Please try again.",
                    preset: ToastPresets.FAILURE,
                });
                return;
            }

            // Signup/Login OTP verification (temporary local check)
            if (expected && code === expected) {
                Toaster({
                    visible: true,
                    message: "Verification successful",
                    preset: ToastPresets.SUCCESS,
                });

                router.replace(
                    role === "provider"
                        ? "/(main)/(provider)/(tabs)/home"
                        : "/(main)/(customer)/(tabs)/home"
                );
                return;
            }

            Toaster({
                visible: true,
                message: "Invalid code. Please try again.",
                preset: ToastPresets.FAILURE,
            });
        }
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
                    Enter verification code
                </Text>
                <Text
                    marginT-8
                    small
                    regular
                    style={{ color: "#818898", lineHeight: moderateScale(22) }}
                >
                    We have just sent you 4 digit code via your email{" "}
                    <Text semibold style={{ color: "#fff" }}>{normalizedEmail}</Text>
                </Text>
            </View>

            {/* OTP Input Container */}
            <View row spread width="100%" marginT-40>
                {otp.map((digit, index) => (
                    <View
                        key={index}
                        width={moderateScale(60)}
                        height={moderateScale(60)}
                        center
                        style={{
                            borderRadius: moderateScale(15),
                            borderWidth: 1.5,
                            borderColor: digit ? theme.color.primary : "#3A3A3A",
                            backgroundColor: "#1E1E1E",
                        }}
                    >
                        <TextInput
                            ref={inputRefs[index]}
                            style={{
                                fontSize: moderateScale(theme.fontSize.large24),
                                fontWeight: "700",
                                color: "#fff",
                                textAlign: "center",
                                width: "100%",
                                height: "100%",
                            }}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={digit}
                            onChangeText={(v) => handleOtpChange(v, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                        />
                    </View>
                ))}
            </View>

            {/* Continue Button */}
            <View width="100%" marginT-50>
                <CustomButton
                    label="Continue"
                    onPress={handleContinue}
                    disabled={otp.join("").length < 4}
                />
            </View>

            {/* Resend Code Footer */}
            <View row center marginT-30>
                <Text small regular style={{ color: "#818898" }}>
                    Didn’t receive code?{" "}
                </Text>
                <TouchableOpacity onPress={() => { }}>
                    <Text small semibold style={{ color: theme.color.primary }}>
                        Resend Code
                    </Text>
                </TouchableOpacity>
            </View>
            <SuccessDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                title="You have logged in successfully"
                description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                buttonLabel="Continue"
                onButtonPress={() => {
                    if (scrn == "forgotPassword") {
                        router.push({ pathname: "/createPassword", params: { email: normalizedEmail } });
                    } else if (role == "provider") {
                        if (scrn == "signup") {
                            router.push("/verifyProvider");
                        } else {
                            router.push("/(main)/(provider)/(tabs)/home");
                        }
                    } else {
                        router.push("/(main)/(customer)/(tabs)/home");
                    }
                    setDialogVisible(false);
                }}
            />
            <Dialog
                visible={verificationDialogVisible}
                onDismiss={() => setVerificationDialogVisible(false)}
                width={SCREEN_WIDTH * 0.87}
                height={SCREEN_HEIGHT * 0.75}
                center
                containerStyle={{
                    borderRadius: moderateScale(15),
                    maxHeight: SCREEN_HEIGHT
                }}
                ignoreBackgroundPress
            >
                <View center flex padding-30>
                    <Image
                        source={require("@/assets/images/check.png")}
                        width={moderateScale(120)}
                        height={moderateScale(120)}
                        resizeMode="contain"
                    />
                    <Text center black bold large24 marginT-30>
                        Verify your identity!
                    </Text>
                    <Text gray medium small center marginT-12>
                        Innovative Events recommends to verify your
                        identity on their platform to receive special benefits:
                    </Text>
                    <View width={"100%"} marginT-12>
                        {
                            verficationBenefits.map((item, index) => (
                                <View>
                                    <Text key={index} black medium small marginT-12>
                                        {item}
                                    </Text>
                                    <View height={moderateScale(1)} backgroundColor="#E0E0E0" marginT-12 />
                                </View>
                            ))
                        }
                    </View>
                    <CustomButton
                        marginT-30
                        label="Continue"
                        onPress={() => {
                            if (role == "provider") {
                                if (scrn == "signup") {
                                    router.push("/verifyProvider");
                                } else {
                                    router.push("/(main)/(provider)/(tabs)/home");
                                }
                            } else {
                                router.push("/(main)/(customer)/(tabs)/home");
                            }
                            setVerificationDialogVisible(false);
                        }}
                        style={{ width: "100%" }}
                    />
                </View>
            </Dialog>
        </Container>
    );
};

export default Otp;
