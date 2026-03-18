import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const StartJob = () => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

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
            // Navigate to next screen (Reset Password or Success)
            router.push("/startTimer")
        }
    };

    return (
        <Container appBar appBarTitle="" containerProps={{ centerH: true }}>
            {/* Title & Subtitle */}
            <Text black bold large24 marginT-40>
                Start Job
            </Text>
            <Text gray regular center marginT-12 style={{ lineHeight: moderateScale(22) }}>
                Please enter the verification code that the user has received to start the Job
            </Text>

            {/* OTP Input Container */}
            <View row spread width="100%" marginT-50 paddingH-20>
                {otp.map((digit, index) => (
                    <View
                        key={index}
                        width={moderateScale(60)}
                        height={moderateScale(60)}
                        center
                        style={{
                            borderRadius: moderateScale(25),
                            borderWidth: 1.5,
                            borderColor: digit ? theme.color.primary : "#E0E0E0",
                            backgroundColor: "#fff",
                        }}
                    >
                        <TextInput
                            ref={inputRefs[index]}
                            style={{
                                fontSize: moderateScale(theme.fontSize.large24),
                                fontWeight: "700",
                                color: "black",
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
            <View width="100%" marginT-70>
                <CustomButton
                    label="Continue"
                    onPress={handleContinue}
                    disabled={otp.join("").length < 4}
                />
            </View>
        </Container>
    );
};

export default StartJob;
