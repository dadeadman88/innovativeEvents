import Icon from "@/components/Icon";
import { useTheme } from "@/redux/actions/hooks/useTheme";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

interface TabItem {
  name: string;
  label: string;
  icon: any;
  vectorIcon?: {
    vector: React.ComponentProps<typeof Icon>["vector"];
    name: string;
  };
  activeIcon?: any;
}

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
  /** "customer" | "provider" – determines which set of labels/icons to show */
  role?: "customer" | "provider";
}

const CUSTOMER_TABS: TabItem[] = [
  { name: "home", label: "Home", icon: require("../assets/images/tabs/home.png") },
  { name: "myEvents", label: "My Events", icon: require("../assets/images/tabs/calendar.png") },
  // Center action tab (custom rendering)
  { name: "create", label: "Create", icon: null },
  { name: "notifications", label: "Notifications", icon: null, vectorIcon: { vector: "Feather", name: "bell" } },
  { name: "profile", label: "Profile", icon: require("../assets/images/tabs/profile.png") },
];

const PROVIDER_TABS: TabItem[] = [
  { name: "home", label: "Home", icon: require("../assets/images/tabs/home.png") },
  { name: "myEvents", label: "My Events", icon: require("../assets/images/tabs/calendar.png") },
  // Center action tab (custom rendering)
  { name: "chat", label: "Chat", icon: null, vectorIcon: { vector: "Ionicons", name: "chatbubble-ellipses-outline" } },
  { name: "notifications", label: "Notifications", icon: null, vectorIcon: { vector: "Feather", name: "bell" } },
  { name: "profile", label: "Profile", icon: require("../assets/images/tabs/profile.png") },
];

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation, role = "customer" }) => {
  const tabs = role === "provider" ? PROVIDER_TABS : CUSTOMER_TABS;
  const { effectiveTheme } = useTheme();

  const isDarkMode = effectiveTheme === 'dark';

  // Tab colors (design uses dark bar w/ white active + grey inactive; create uses theme blue)
  const activeTintColor = "#FFFFFF";
  const inactiveTintColor = "#6C6C6C";

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const tab = tabs.find((t) => t.name === route.name);
        // Back-compat: some navigation states may still label the center action as "create".
        const isCenterAction =
          role === "provider" ? route.name === "chat" || route.name === "create" : route.name === "create";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenterAction) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() =>
                router.push(
                  role === "provider"
                    ? "/(main)/(provider)/(tabs)/chat"
                    : "/(main)/(customer)/createEvent"
                )
              }
              style={styles.createTabItem}
              activeOpacity={0.8}
            >
              <View style={styles.createButtonOuter}>
                <View style={styles.createButtonInner}>
              {role === "provider" ? (
                  <Icon vector="Ionicons" name="chatbubble-ellipses-outline" size={28} color="#fff" />
                ) : (
                  <Icon vector="Ionicons" name="add" size={28} color="#fff" />
                )}
                </View>
              </View>
              <Text style={[styles.label, { color: theme.color.primary, marginTop: verticalScale(2) }]}>
                {role === "provider" ? "Chat" : "Create"}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {tab?.vectorIcon ? (
                <Icon
                  vector={tab.vectorIcon.vector}
                  name={tab.vectorIcon.name}
                  size={moderateScale(24)}
                  color={isFocused ? activeTintColor : inactiveTintColor}
                />
              ) : (
                <Image
                  source={tab?.icon}
                  style={[
                    styles.icon,
                    {
                      tintColor: isFocused ? activeTintColor : inactiveTintColor,
                    },
                  ]}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? activeTintColor : inactiveTintColor,
                },
              ]}
            >
              {tab?.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    paddingVertical: verticalScale(8),
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(8),
  },
  createTabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(2),
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
  },
  icon: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(12),
    fontWeight: "500",
    textAlign: "center",
  },
  createButtonOuter: {
    width: moderateScale(62),
    height: moderateScale(62),
    borderRadius: moderateScale(31),
    backgroundColor: "#0B0B0B",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -verticalScale(30),
  },
  createButtonInner: {
    width: moderateScale(54),
    height: moderateScale(54),
    borderRadius: moderateScale(27),
    backgroundColor: theme.color.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
});

export default TabBar;
