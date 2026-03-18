import { useTheme } from "@/redux/actions/hooks/useTheme";
import { theme } from "@/utils/designSystem";
import * as React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView
} from "react-native";
import { View, ViewProps } from "react-native-ui-lib";
import AppBar from "./Header";

const { height } = Dimensions.get("window");

interface ContainerProps {
  backgroundColor?: string;
  contentBackgroundColor?: string;
  children: any;
  scrollProps?: any;
  containerProps?: ViewProps;
  scrollEnabled?: boolean;
  appBar?: boolean;
  appBarTitle?: string;
  appBarSubtitle?: string;
  back?: boolean;
  light?: boolean;
  noLeft?: boolean;
  LeftPress?: () => void;
  appBarRight?: any;
  extraLargeAppBarTitle?: boolean;
  onAppBarTitlePress?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const Container = React.memo(
  ({
    scrollEnabled = true,
    containerProps,
    children,
    LeftPress,
    appBar = true,
    appBarTitle,
    back = false,
    light = false,
    noLeft = false,
    scrollProps,
    backgroundColor = theme.color.containerBackground,
    contentBackgroundColor,
    appBarSubtitle = "",
    appBarRight,
    extraLargeAppBarTitle,
    onAppBarTitlePress,
    refreshing = false,
    onRefresh,
  }: ContainerProps) => {
    const { effectiveTheme } = useTheme();
    const isDarkMode = effectiveTheme === "dark";

    const Header = React.useCallback(() => {
      return (
        <AppBar
          backgroundColor={isDarkMode ? theme.color.textColor : backgroundColor}
          drawer={!back}
          LeftPress={LeftPress}
          title={appBarTitle}
          noLeft={noLeft}
          light={light}
          subtitle={appBarSubtitle}
          right={appBarRight}
          extraLarge={extraLargeAppBarTitle}
          titlePress={onAppBarTitlePress}
        />
      );
    }, [
      LeftPress,
      appBarRight,
      appBarSubtitle,
      appBarTitle,
      back,
      backgroundColor,
      extraLargeAppBarTitle,
      isDarkMode,
      light,
      noLeft,
      onAppBarTitlePress,
    ]);

    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "android" ? "height" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View flex key={effectiveTheme} style={contentBackgroundColor ? { backgroundColor: contentBackgroundColor } : undefined} bg-containerBackground={!contentBackgroundColor}>
          <ScrollView
            scrollEnabled={scrollEnabled}
            contentContainerStyle={{
              height: scrollEnabled
                ? null
                : Platform.OS === "android"
                  ? height * 0.95
                  : height * 0.9,
            }}
            style={{ flex: 1, backgroundColor: "transparent" }}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.color.primary}
                  colors={[theme.color.primary]}
                />
              ) : undefined
            }
            {...scrollProps}
          >
            {appBar && <Header />}
            <View
              key={effectiveTheme}
              flex
              style={{ paddingHorizontal: "6%", paddingBottom: "4%" }}
              {...containerProps}
            >
              {children}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }
);

Container.displayName = "Container";

export default Container;
