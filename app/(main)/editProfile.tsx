import CustomButton from "@/components/Button";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import SuccessDialog from "@/components/SuccessDialog";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const accentBlue = "#109CD9";

const EditProfile = () => {
    const [successVisible, setSuccessVisible] = React.useState(false);
    const inputFieldStyle = {
        backgroundColor: "#1E1E1E",
        height: verticalScale(45),
        borderRadius: moderateScale(15),
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
            {/* Header: same back button + title as eventDetail */}
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
                        Edit Profile
                    </Text>
                </View>
                <View style={{ width: moderateScale(50) }} />
            </View>

            {/* Avatar: entire area touchable, camera icon overlay */}
            <View center marginT-20>
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {}}
                    style={{
                        borderRadius: moderateScale(42),
                        borderWidth: 2,
                        borderColor: accentBlue,
                    }}
                >
                    <View br100 style={{ overflow: "hidden" }}>
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3270&auto=format&fit=crop",
                            }}
                            width={moderateScale(80)}
                            height={moderateScale(80)}
                        />
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            right: moderateScale(-5),
                            bottom: moderateScale(-5),
                            width: moderateScale(32),
                            height: moderateScale(32),
                            borderRadius: moderateScale(16),
                            backgroundColor: accentBlue,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Icon vector="Ionicons" name="camera" size={18} color="#fff" />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View marginT-28>
                <Input
                    label="Full Name"
                    placeholder="Aaron Ramsdale"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                />
                <View marginT-20 />
                <Input
                    label="Email"
                    placeholder="aaronramsdale@gmail.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                />
                <View marginT-20 />
                <Input
                    label="Phone Number"
                    placeholder="(409) 487-1935"
                    keyboardType="phone-pad"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                />
                <View marginT-20 />
                <Input
                    label="Date of Birth"
                    placeholder="December 20, 1998"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                    trailingAccessory={
                        <View style={{ marginRight: 12 }}>
                            <Icon
                                vector="Ionicons"
                                name="calendar-outline"
                                size={20}
                                color="#818898"
                            />
                        </View>
                    }
                />
                <View marginT-20 />
                <Input
                    label="Gender"
                    placeholder="Male"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                    trailingAccessory={
                        <View style={{ marginRight: 12 }}>
                            <Icon
                                vector="Ionicons"
                                name="chevron-down"
                                size={20}
                                color="#818898"
                            />
                        </View>
                    }
                />
            </View>

            {/* Save Changes Button */}
            <View marginT-40 paddingB-40>
                <CustomButton
                    label="Save Changes"
                    onPress={() => setSuccessVisible(true)}
                />
            </View>

            <SuccessDialog
                visible={successVisible}
                onDismiss={() => setSuccessVisible(false)}
                title="Profile updated successfully"
                buttonLabel="OK"
                onButtonPress={() => {
                    setSuccessVisible(false);
                    router.back();
                }}
            />
        </Container>
    );
};

export default EditProfile;
