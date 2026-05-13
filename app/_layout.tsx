import CustomButton from "@/components/Button";
import { useDesignSystem } from "@/hooks/useDesignSystem";
import { useLogout } from "@/redux/actions/hooks/useAuth";
import {
    useLoading,
    useLoginModal,
    useToast,
} from "@/redux/actions/hooks/useOthers";
import { useTheme } from "@/redux/actions/hooks/useTheme";
import { store } from "@/redux/store";
import { SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";
import {
    Dialog,
    Incubator,
    LoaderScreen,
    Text,
    View
} from "react-native-ui-lib";
import { Provider } from "react-redux";
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("react-native-ui-lib/config").setConfig({ appScheme: "default" });

export default function RootLayout() {
    useDesignSystem();

    return (
        <Provider store={store}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Navigation />
            </GestureHandlerRootView>
        </Provider>
    );
}

function Navigation() {
    const { toast, Toaster } = useToast();
    const { logoutLocal } = useLogout();
    const { loading } = useLoading();
    const { loginModal, hideModal } = useLoginModal();
    const { effectiveTheme, init } = useTheme();
    const isDark = effectiveTheme === "dark";


    React.useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#000",
            }}
        >
            <StatusBar
                style="light"
                backgroundColor="#000"
            />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(initialRoute)" />
                <Stack.Screen name="(main)" />
                <Stack.Screen
                    name="(main)/chooseLocation"
                    options={{ presentation: "modal" }}
                />
            </Stack>
            {loading && (
                <LoaderScreen
                    overlay
                    loaderColor={theme.color.primary}
                    messageStyle={{
                        color: isDark ? "#fff" : "#000",
                        fontSize: theme.fontSize.regular,
                        fontFamily: theme.font.semibold,
                    }}
                    message="Loading..."
                    backgroundColor={
                        !isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
                    }
                />
            )}
            <Incubator.Toast
                backgroundColor={"#fff"}
                autoDismiss={2000}
                swipeable
                position="top"
                messageStyle={{
                    color: "#000",
                    fontSize: theme.fontSize.regular,
                    fontFamily: theme.font.regular,
                }}
                onDismiss={() => {
                    Toaster({ visible: false });
                }}
                {...toast}
            />
            <Dialog
                visible={loginModal.visible}
                onDismiss={hideModal}
                center
                width={SCREEN_WIDTH * 0.9}
                direction={Dialog.directions.DOWN}
                containerStyle={{
                    backgroundColor: isDark
                        ? theme.dark_color.containerBackground
                        : "#fff",
                    borderRadius: moderateScale(15),
                    padding: moderateScale(30),
                    marginHorizontal: moderateScale(5),
                }}
            >
                <View center gap-20>
                    <Text textColor bold large24 center>
                        Login Required
                    </Text>
                    <Text textColor regular regularSize center>
                        {loginModal.message || "You need to login to access this feature"}
                    </Text>
                    <View gap-10 width={"100%"}>
                        <CustomButton
                            label="Sign In"
                            onPress={() => {
                                hideModal();
                                logoutLocal();
                            }}
                        />
                        <CustomButton
                            label="Sign Up"
                            backgroundColor={"#fff"}
                            style={{
                                borderColor: theme.color.borderColor,
                                borderWidth: 1,
                            }}
                            color={theme.color.textColor}
                            onPress={() => {
                                hideModal();
                                logoutLocal();
                            }}
                        />
                    </View>
                </View>
            </Dialog>
        </SafeAreaView>
    );
}
