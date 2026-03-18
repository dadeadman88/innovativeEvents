import { theme } from "@/utils/designSystem";
import * as React from "react";
import { Platform, useColorScheme } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Picker, PickerProps, View } from "react-native-ui-lib";
import Icon from "./Icon";

const PickerC = (props: PickerProps) => {
  const isDark = useColorScheme() === "dark";

  return (
    <Picker
      placeholder="Select"
      black
      style={{
        marginEnd: 10,
        height: Platform.select({
          android: verticalScale(50),
          ios: verticalScale(45),
        }),
      }}
      medium
      small
      useSafeArea
      placeholderTextColor={isDark ? "#fff" : "#aaa"}
      trailingAccessory={
        <View absR style={{ right: scale(10), ...props?.iconStyle }}>
          <Icon
            vector="Entypo"
            name={props?.iconName ? props?.iconName : "chevron-down"}
            color={props?.iconColor ? props?.iconColor : theme.color.gray}
            size={20}
          />
        </View>
      }
      {...props}
      labelProps={{
        medium: true,
        small: true,
        color: isDark ? "#fff" : theme.color.gray,
        "marginB-10": true,
        ...props.labelProps,
      }}
      fieldStyle={{
        backgroundColor: theme.color.inputBg,
        borderRadius: 30,
        paddingHorizontal: "6%",
        ...props?.fieldStyle,
      }}
      floatingPlaceholderStyle={{
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        fontFamily: theme.font.regular,
        ...props?.floatingPlaceholderStyle,
      }}
    />
  );
};

export default PickerC;
