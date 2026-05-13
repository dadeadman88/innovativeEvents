import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import SuccessDialog from "@/components/SuccessDialog";
import { AuthActions } from "@/redux/actions/AuthActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { AppDispatch, RootState } from "@/redux/store";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Image, Text, ToastPresets, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

const accentBlue = "#109CD9";

const EditProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { Toaster } = useToast();
    const user = useSelector((state: RootState) => state.auth.user);
    const email = user?.email ?? "";
    const role = user?.role;

    const [successVisible, setSuccessVisible] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        phone: user?.phone ?? "",
        title: user?.title ?? "",
        company: user?.company ?? "",
    });
    const [didSubmit, setDidSubmit] = React.useState(false);

    const inputFieldStyle = {
        backgroundColor: "#1E1E1E",
        height: verticalScale(45),
        borderRadius: moderateScale(15),
    };
    const inputLabelStyle = { color: "#fff" };

    const showValidationToast = (message: string) => {
        Toaster({
            visible: true,
            message,
            preset: ToastPresets.FAILURE,
        });
    };

    const handleSave = async () => {
        setDidSubmit(true);
        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const title = formData.title.trim();
        const company = formData.company.trim();
        const phone = formData.phone?.trim() ?? "";

        if (!firstName) return showValidationToast("First name is required");
        if (!lastName) return showValidationToast("Last name is required");
        if (!title) return showValidationToast("Title is required");
        if (!company) return showValidationToast("Company name is required");

        const backendRole: "user" | "contractor" =
            role === "contractor" ? "contractor" : "user";

        try {
            await dispatch(
                AuthActions.UpdateProfile({
                    role: backendRole,
                    first_name: firstName,
                    last_name: lastName,
                    mobile_number: phone || undefined,
                    title,
                    company,
                })
            ).unwrap();
            setSuccessVisible(true);
        } catch (err) {
            if (typeof err === "string") {
                showValidationToast(err);
            }
        }
    };

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

            {/* Avatar: entire area touchable; camera icon disabled for now */}
            <View center marginT-20>
                <TouchableOpacity
                    activeOpacity={1}
                    disabled={true}
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
                                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxoVYK9gVqDWkfv3blKuxWEO0t9JrH6XSjxg&s",
                            }}
                            width={moderateScale(80)}
                            height={moderateScale(80)}
                        />
                    </View>
                    {/*
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
                    */}
                </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View marginT-28>
                <View row gap-12 marginB-16>
                    <View flex>
                        <Input
                            label="First Name"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChangeText={(t) =>
                                setFormData((p) => ({ ...p, firstName: t }))
                            }
                            labelProps={{ style: inputLabelStyle } as any}
                            fieldStyle={inputFieldStyle}
                            placeholderTextColor="#818898"
                            style={{ color: "#fff" }}
                            onBlur={() => {
                                if (!didSubmit) return;
                                if (!formData.firstName.trim()) {
                                    showValidationToast("First name is required");
                                }
                            }}
                        />
                    </View>
                    <View flex>
                        <Input
                            label="Last Name"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChangeText={(t) =>
                                setFormData((p) => ({ ...p, lastName: t }))
                            }
                            labelProps={{ style: inputLabelStyle } as any}
                            fieldStyle={inputFieldStyle}
                            placeholderTextColor="#818898"
                            style={{ color: "#fff" }}
                            onBlur={() => {
                                if (!didSubmit) return;
                                if (!formData.lastName.trim()) {
                                    showValidationToast("Last name is required");
                                }
                            }}
                        />
                    </View>
                </View>
                <Input
                    label="Email"
                    placeholder="aaronramsdale@gmail.com"
                    value={email}
                    editable={false}
                    selectTextOnFocus={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#6C6C6C" }}
                />
                <View marginT-20 />
                <Input
                    label="Phone Number"
                    placeholder="(409) 487-1935 (optional)"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(t) =>
                        setFormData((p) => ({ ...p, phone: t }))
                    }
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                />
                <View marginT-20 />
                <Input
                    label="Title"
                    placeholder="Your title"
                    value={formData.title}
                    onChangeText={(t) => setFormData((p) => ({ ...p, title: t }))}
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                    onBlur={() => {
                        if (!didSubmit) return;
                        if (!formData.title.trim()) {
                            showValidationToast("Title is required");
                        }
                    }}
                />
                <View marginT-20 />
                <Input
                    label="Company"
                    placeholder="Your company"
                    value={formData.company}
                    onChangeText={(t) =>
                        setFormData((p) => ({ ...p, company: t }))
                    }
                    labelProps={{ style: inputLabelStyle } as any}
                    fieldStyle={inputFieldStyle}
                    placeholderTextColor="#818898"
                    style={{ color: "#fff" }}
                    onBlur={() => {
                        if (!didSubmit) return;
                        if (!formData.company.trim()) {
                            showValidationToast("Company name is required");
                        }
                    }}
                />
            </View>

            {/* Save Changes Button */}
            <View marginT-40 paddingB-40>
                <CustomButton label="Save Changes" onPress={handleSave} />
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
