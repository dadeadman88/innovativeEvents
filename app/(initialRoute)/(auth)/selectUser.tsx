import CustomButton from "@/components/Button";
import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { useState } from "react";
import { moderateScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

const SelectUser = () => {
    const [selectedRole, setSelectedRole] = useState<"customer" | "provider" | null>(null);

    const roles = [
        {
            id: "customer",
            label: "Client Portal",
        },
        {
            id: "provider",
            label: "Brand Ambassador",
        },
    ];

    const handleContinue = () => {
        if (selectedRole) {
            router.push({
                pathname: "/login",
                params: {
                    role: selectedRole,
                },
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

            {/* Heading & Subtitle */}
            <Text style={{ color: "#fff" }} semibold large24>
                Select your Role
            </Text>
            <Text regular small marginT-5 style={{ color: "#818898" }}>
                Choose how you'd like to continue.
            </Text>

            {/* Selection Options */}
            <View marginT-40 width="100%" gap-16>
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                        <TouchableOpacity
                            key={role.id}
                            onPress={() => setSelectedRole(role.id as any)}
                            activeOpacity={0.8}
                            row
                            centerV
                            paddingH-20
                            paddingV-14
                            gap-16
                            style={{
                                backgroundColor: "#1E1E1E",
                                borderRadius: moderateScale(15),
                            }}
                        >
                            {/* Radio Button Circle on the Left */}
                            <View
                                width={26}
                                height={26}
                                br100
                                center
                                style={{
                                    borderWidth: 2,
                                    borderColor: isSelected ? theme.color.primary : "#6C6C6C",
                                    backgroundColor: "transparent",
                                }}
                            >
                                {isSelected && (
                                    <View
                                        width={14}
                                        height={14}
                                        br100
                                        backgroundColor={theme.color.primary}
                                    />
                                )}
                            </View>

                            {/* Role Label */}
                            <Text style={{ color: "#fff", paddingLeft: 15 }} white regular mediumSize flex>
                                {role.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Continue Button */}
            <View width="100%" marginT-40>
                <CustomButton
                    label="Continue"
                    onPress={handleContinue}
                    disabled={!selectedRole}
                />
            </View>
        </Container>
    );
};

export default SelectUser;
