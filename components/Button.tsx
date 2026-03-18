import { theme } from "@/utils/designSystem";
import * as React from "react";
import { Platform } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { Button, ButtonProps, Colors } from "react-native-ui-lib";

type CustomButtonProps = ButtonProps & {
  variant?: "primary" | "secondary" | "onboarding";
  shadow?: boolean;
};

const CustomButton = (props: CustomButtonProps) => {
  const { variant = "primary", shadow = true, ...buttonProps } = props;
  const isDarkMode = Colors.getScheme() === "dark";
  const isOnboarding = variant === "onboarding";
  return (
    <Button
      borderRadius={15}
      bg-primary={variant === "primary" && !isOnboarding}
      backgroundColor={isOnboarding ? theme.color.onboardingBlue : undefined}
      outline={variant === "secondary"}
      outlineColor={variant === "secondary" ? theme.color.primary : buttonProps.outlineColor}
      color={isDarkMode || isOnboarding ? (buttonProps.color || "#fff") : buttonProps.color || "#fff"}
      regularSize
      semibold
      {...buttonProps}
      style={{
        height: Platform.select({
          android: verticalScale(50),
          ios: verticalScale(45),
        }),
        ...(shadow ? {
          shadowColor: theme.color.gray,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        } : {}),
        ...(buttonProps?.style as object),
      }}
    />
  );
};

export default CustomButton;
