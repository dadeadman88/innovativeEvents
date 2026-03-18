import * as React from "react";
import {
  Platform,
  StyleSheet
} from "react-native";
import { verticalScale } from "react-native-size-matters";
import { Colors, DateTimePicker, DateTimePickerProps } from "react-native-ui-lib";
import { theme } from "../utils/designSystem";


const DTPicker = (props: DateTimePickerProps) => {
  const [showError, setShowError] = React.useState(false);
  const isDarkMode = Colors.getScheme() === "dark";

  return (
    <DateTimePicker
      style={{
        marginHorizontal: "2%",
        height: Platform.select({
          android: verticalScale(45),
          ios: verticalScale(40),
        }),
        ...(props.style as object),
      }}
      medium
      small
      textColor
      placeholderTextColor={
        isDarkMode
          ? theme.dark_color.placeholderColor
          : theme.color.placeholderColor
      }
      validateOnChange
      enableErrors={showError}
      {...props}
      floatingPlaceholderStyle={{
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        paddingHorizontal: 5,
        fontFamily: theme.font.regular,
        ...(props?.floatingPlaceholderStyle as object),
      }}
      onChangeValidity={(valid) => {
        setShowError(!valid);
        if (props?.onChangeValidity) props?.onChangeValidity(valid);
      }}
      labelProps={{
        medium: true,
        small: true,
        "marginB-10": true,
        ...(props.labelProps as object),
      }}
      fieldStyle={[
        styles.outline,
        {
          borderColor: isDarkMode
            ? theme.dark_color.borderColor
            : theme.color.borderColor,
          backgroundColor: isDarkMode
            ? theme.dark_color.grayBackground
            : theme.color.grayBackground,
          paddingHorizontal: "4%",
          justifyContent: "center",
          alignItems: "center",
          ...(props.fieldStyle as object),
        },
      ]}
    />
  );
};

export default DTPicker;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    //borderRadius: moderateScale(100)
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.color.grayBackground,
    borderRadius: 10,
  },
});
