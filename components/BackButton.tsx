import Icon from "@/components/Icon";
import { router } from "expo-router";
import * as React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-ui-lib";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const BackButton = ({
  onPress,
  color = "#fff",
  size = moderateScale(24),
  style,
}: BackButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={[
        {
          width: moderateScale(50),
          height: moderateScale(50),
          justifyContent: "center",
          marginBottom: 24,
        },
        style,
      ]}
    >
      <Icon
        vector="MaterialIcons"
        name="arrow-back"
        size={size}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
