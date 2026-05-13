import AskDialog from "@/components/AskDialog";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { AuthActions } from "@/redux/actions/AuthActions";
import { LogoutUser } from "@/redux/slices/AuthSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Switch, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [pushEnabled, setPushEnabled] = React.useState(true);
    const [askLogoutVisible, setAskLogoutVisible] = React.useState(false);
    const [askDeleteVisible, setAskDeleteVisible] = React.useState(false);
    const fullName = useSelector((state: RootState) => state.auth.user?.fullName);
    const email = useSelector((state: RootState) => state.auth.user?.email);
    const Row = ({
        icon,
        label,
        onPress,
        right,
    }: {
        icon: { vector: React.ComponentProps<typeof Icon>["vector"]; name: string };
        label: string;
        onPress?: () => void;
        right?: React.ReactNode;
    }) => {
        return (
            <TouchableOpacity
                row
                centerV
                spread
                paddingV-16
                onPress={onPress}
                disabled={!onPress}
                activeOpacity={0.8}
            >
                <View row centerV>
                    <Icon vector={icon.vector} name={icon.name} size={22} color="#fff" />
                    <Text marginL-14 regular regularSize style={{ color: "#fff" }}>
                        {label}
                    </Text>
                </View>
                {right ?? (
                    <Icon
                        vector="Ionicons"
                        name="chevron-forward-outline"
                        size={20}
                        color="#818898"
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollProps={{ showsVerticalScrollIndicator: false }}
            containerProps={{
                style: {
                    paddingTop: 16,
                    paddingHorizontal: "6%",
                    paddingBottom: "8%",
                },
            }}
        >
            {/* Profile Header */}
            <View marginT-10>
                <Image
                    source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxoVYK9gVqDWkfv3blKuxWEO0t9JrH6XSjxg&s" }}
                    style={{
                        width: moderateScale(72),
                        height: moderateScale(72),
                        borderRadius: moderateScale(36),
                    }}
                />

                <Text marginT-16 bold large28 style={{ color: "#fff" }}>
                    {fullName}
                </Text>
                <Text marginT-6 regular regularSize style={{ color: "#818898" }}>
                    {email}
                </Text>

                <TouchableOpacity
                    marginT-18
                    paddingV-10
                    paddingH-24
                    style={{
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(12),
                        alignSelf: "flex-start",
                    }}
                    onPress={() => router.push("/editProfile")}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Edit Profile
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Menu */}
            <View marginT-28>
                <Row
                    icon={{ vector: "Ionicons", name: "notifications-outline" }}
                    label="Push Notification"
                    right={
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            onColor={theme.color.primary}
                        />
                    }
                />
                <View height={1} style={{ backgroundColor: "#2A2A2A" }} />
                <Row
                    icon={{ vector: "Ionicons", name: "help-circle-outline" }}
                    label="Help Center"
                    onPress={() => router.push("/support")}
                />
                <View height={1} style={{ backgroundColor: "#2A2A2A" }} />
                <Row
                    icon={{ vector: "Ionicons", name: "lock-closed-outline" }}
                    label="Privacy Policy"
                    onPress={() =>
                        router.push({
                            pathname: "/about",
                            params: { title: "Privacy Policy" },
                        })
                    }
                />
                <View height={1} style={{ backgroundColor: "#2A2A2A" }} />
                <Row
                    icon={{ vector: "Ionicons", name: "information-circle-outline" }}
                    label="About App"
                    onPress={() =>
                        router.push({
                            pathname: "/about",
                            params: { title: "About App" },
                        })
                    }
                />
                <View height={1} style={{ backgroundColor: "#2A2A2A" }} />
                <Row
                    icon={{ vector: "Ionicons", name: "document-text-outline" }}
                    label="Terms & Conditions"
                    onPress={() =>
                        router.push({
                            pathname: "/about",
                            params: { title: "Terms & Conditions" },
                        })
                    }
                />
                <View height={1} style={{ backgroundColor: "#2A2A2A" }} />

                {/* Delete account */}
                <TouchableOpacity
                    row
                    centerV
                    spread
                    paddingV-16
                    onPress={() => setAskDeleteVisible(true)}
                    activeOpacity={0.8}
                >
                    <View row centerV>
                        <Icon vector="Ionicons" name="trash-outline" size={22} color="#EF4444" />
                        <Text marginL-14 regular regularSize style={{ color: "#EF4444" }}>
                            Delete account
                        </Text>
                    </View>
                    <Icon
                        vector="Ionicons"
                        name="chevron-forward-outline"
                        size={20}
                        color="#EF4444"
                    />
                </TouchableOpacity>
            </View>

            {/* Logout (red only on this screen) */}
            <View marginT-32>
                <CustomButton
                    label="Log Out"
                    onPress={() => setAskLogoutVisible(true)}
                    backgroundColor="#EF4444"
                    iconSource={require("@/assets/images/logout.png")}
                    iconStyle={{
                        width: moderateScale(18),
                        height: moderateScale(18),
                        tintColor: "#fff",
                        marginRight: moderateScale(8),
                    } as any}
                />
            </View>

            <AskDialog
                visible={askLogoutVisible}
                onDismiss={() => setAskLogoutVisible(false)}
                title="Are you sure you want to logout?"
                imageSource={require("@/assets/images/logout.png")}
                yesLabel="Yes"
                noLabel="No"
                onNo={() => setAskLogoutVisible(false)}
                onYes={() => {
                    setAskLogoutVisible(false);
                    dispatch(LogoutUser());
                    router.replace("/login");
                }}
            />

            <AskDialog
                visible={askDeleteVisible}
                onDismiss={() => setAskDeleteVisible(false)}
                title="Are you sure you want to delete your account? This action cannot be undone."
                yesLabel="Yes"
                noLabel="No"
                icon={{
                    vector: "Ionicons",
                    name: "trash-outline",
                    color: "#EF4444",
                    size: moderateScale(30),
                }}
                onNo={() => setAskDeleteVisible(false)}
                onYes={async () => {
                    setAskDeleteVisible(false);
                    try {
                        await dispatch(AuthActions.DeleteAccount()).unwrap();
                        dispatch(LogoutUser());
                        router.replace("/getStarted");
                    } catch {
                        // error toast from AxiosInterceptor
                    }
                }}
            />
        </Container>
    );
};

export default Profile;
