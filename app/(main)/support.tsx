import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import SuccessDialog from "@/components/SuccessDialog";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const Support = () => {
    const [successVisible, setSuccessVisible] = React.useState(false);
    const inputFieldStyle = {
        backgroundColor: "#1E1E1E",
        height: verticalScale(45),
        borderRadius: moderateScale(15),
    };
    const messageFieldStyle = {
        ...inputFieldStyle,
        height: moderateScale(120),
        alignItems: "flex-start" as const,
        paddingTop: 10,
    };
    const inputLabelStyle = { color: "#fff" };

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{
                style: {
                    paddingHorizontal: "6%",
                    paddingBottom: "8%",
                },
            }}
        >
            {/* Header: back button + title */}
            <View
                row
                centerV
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    alignItems: "center",
                }}
            >
                <BackButton style={{ marginBottom: 0 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        Support
                    </Text>
                </View>
                <View style={{ width: moderateScale(50) }} />
            </View>

            <View center paddingV-20>
                <Text regular extraSmall center style={{ color: "#818898" }}>
                    Please clarify as to what exactly happened{"\n"}and we'll carefully review the situation.{"\n"}Call on the number for further assistance.
                </Text>
                <View marginT-20>
                    <Text bold large28 center style={{ color: theme.color.primary }}>
                        +1 876 1234 5678
                    </Text>
                </View>
            </View>

            <View marginT-10>
                <Text medium large20 style={{ color: "#fff" }}>
                    Send us a Message
                </Text>

                <View marginT-20>
                    <Input
                        label="Subject*"
                        placeholder="Enter subject"
                        labelProps={{ style: inputLabelStyle } as any}
                        fieldStyle={inputFieldStyle}
                        placeholderTextColor="#818898"
                        style={{ color: "#fff" }}
                    />
                    <View marginT-20 />
                    <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        labelProps={{ style: inputLabelStyle } as any}
                        fieldStyle={inputFieldStyle}
                        placeholderTextColor="#818898"
                        style={{ color: "#fff" }}
                    />
                    <View marginT-20 />
                    <Input
                        label="Email Address"
                        placeholder="Enter your email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        labelProps={{ style: inputLabelStyle } as any}
                        fieldStyle={inputFieldStyle}
                        placeholderTextColor="#818898"
                        style={{ color: "#fff" }}
                    />
                    <View marginT-20 />
                    <Input
                        label="Your Message"
                        placeholder="Enter your message here..."
                        multiline
                        labelProps={{ style: inputLabelStyle } as any}
                        fieldStyle={messageFieldStyle}
                        placeholderTextColor="#818898"
                        style={{ color: "#fff" }}
                    />
                </View>
            </View>

            <View marginT-40 paddingB-40>
                <CustomButton
                    label="Submit"
                    onPress={() => setSuccessVisible(true)}
                />
            </View>

            <SuccessDialog
                visible={successVisible}
                onDismiss={() => setSuccessVisible(false)}
                title="Message sent successfully"
                buttonLabel="OK"
                onButtonPress={() => {
                    setSuccessVisible(false);
                    router.back();
                }}
            />
        </Container>
    );
};

export default Support;
