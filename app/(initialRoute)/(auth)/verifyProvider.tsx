import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import PickerC from "@/components/PickerC";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Picker, Text, TouchableOpacity, View } from "react-native-ui-lib";

const VerifyProvider = () => {
    const [serviceClass, setServiceClass] = React.useState("");
    const [skills, setSkills] = React.useState("");
    const [experience, setExperience] = React.useState("");

    const handleContinue = () => {
        router.push({
            pathname: "/yourLocation",
        });
    };

    return (
        <Container appBar appBarTitle="Verify Yourself">
            {/* Avatar Section */}
            <View centerH marginT-30>
                <View>
                    <View br100 style={{ overflow: "hidden" }}>
                        <Image
                            source={{ uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3270&auto=format&fit=crop" }}
                            width={moderateScale(100)}
                            height={moderateScale(100)}
                        />
                    </View>
                    <TouchableOpacity
                        bg-accent
                        br100
                        padding-6
                        style={{ position: "absolute", bottom: 0, right: 0 }}
                    >
                        <Icon vector="Ionicons" name="camera" size={16} color={theme.color.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Professional Information Section */}
            <Text black semibold large24 marginT-30 marginB-10>
                Professional Information
            </Text>

            {/* Service Class Picker */}
            <PickerC
                label="Select Services Class"
                marginT-10
                value={serviceClass}
                onChange={(value) => setServiceClass(value as string)}
                placeholder="Select a service"
            >
                <Picker.Item label="Home and Appliances" value="home_appliances" />
                <Picker.Item label="Cleaning Services" value="cleaning" />
                <Picker.Item label="Plumbing" value="plumbing" />
                <Picker.Item label="Electrical" value="electrical" />
            </PickerC>

            <Input
                label="Skills and Experties"
                marginT-10
                placeholder="Enter your skills"
                value={skills}
                onChangeText={setSkills}
            />

            {/* Experience Input */}
            <Input
                label="Years of Experience"
                marginT-10
                placeholder="Enter years of experience"
                value={experience}
                onChangeText={setExperience}
                keyboardType="number-pad"
            />

            {/* Certifications Section */}
            <Text black semibold large24 marginT-35>
                Certifications/Licenses
            </Text>
            <Text gray regular small marginT-8>
                Upload a photo of either a driving license or certifications to verify your profile.
            </Text>

            {/* Upload Image Section */}
            <TouchableOpacity
                center
                marginT-20
                paddingV-30
                br20
                style={{
                    borderWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: theme.color.accent,
                    backgroundColor: theme.color.inputBg,
                }}
            >
                <Icon vector="Feather" name="upload-cloud" size={40} color={theme.color.accent} />
                <Text accent semibold small marginT-12>
                    Upload Image Front
                </Text>
                <Text gray regular extraSmall12 marginT-4>
                    Supported formats PNG, GIF or JPG.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                center
                marginT-20
                paddingV-30
                br20
                style={{
                    borderWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: theme.color.accent,
                    backgroundColor: theme.color.inputBg,
                }}
            >
                <Icon vector="Feather" name="upload-cloud" size={40} color={theme.color.accent} />
                <Text accent semibold small marginT-12>
                    Upload Image Back
                </Text>
                <Text gray regular extraSmall12 marginT-4>
                    Supported formats PNG, GIF or JPG.
                </Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <View marginT-40 marginB-30>
                <CustomButton
                    label="Continue"
                    onPress={handleContinue}
                />
            </View>
        </Container>
    );
};

export default VerifyProvider;
