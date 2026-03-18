import * as React from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { TextField, TextFieldProps } from "react-native-ui-lib";
import { theme } from "../utils/designSystem";

const Input = (props: TextFieldProps) => {
  const [showError, setShowError] = React.useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TextField
      style={{
        marginHorizontal: "2%",
        height: Platform.select({
          android: verticalScale(50),
          ios: verticalScale(45),
        }),
        ...(props.style as object),
      }}
      medium
      small
      textColor
      placeholderTextColor={isDarkMode ? theme.dark_color.placeholderColor : theme.color.placeholderColor}
      validateOnChange
      enableErrors={showError}
      {...props}
      floatingPlaceholderStyle={{
        backgroundColor: isDarkMode ? theme.dark_color.white : theme.color.white,
        alignSelf: "flex-start",
        paddingHorizontal: moderateScale(5),
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
        color: isDarkMode ? theme.dark_color.gray : theme.color.gray,
        "marginB-10": true,
        ...(props.labelProps as object),
      }}
      fieldStyle={[
        styles.outline,
        {
          backgroundColor: isDarkMode ? theme.dark_color.inputBg : theme.color.inputBg,
          paddingHorizontal: "5%",
          justifyContent: "center",
          alignItems: "center",
          ...(props.fieldStyle as object),
        },
      ]}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    //borderRadius: moderateScale(100)
  },
  outline: {
    borderWidth: 0,
    borderRadius: moderateScale(30),
  },
});
