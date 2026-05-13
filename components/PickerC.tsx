import { theme } from "@/utils/designSystem";
import * as React from "react";
import { Platform, useColorScheme } from "react-native";
import type { TextStyle } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { Assets, Image, Picker, PickerProps, Text, View } from "react-native-ui-lib";
import type { ModalTopBarProps } from "react-native-ui-lib/src/components/modal/TopBar";
import Icon from "./Icon";

type PickerCProps = PickerProps & {
  iconName?: string;
  iconColor?: string;
  iconStyle?: object;
};

const PickerC: React.FC<PickerCProps> = (props) => {
  const isDark = useColorScheme() === "dark";
  const { iconName, iconColor, iconStyle, renderItem: userRenderItem, ...pickerProps } = props;

  const items = React.useMemo(() => {
    const src = pickerProps.items;
    if (!src) return undefined;
    return src.map((item) => ({
      ...item,
      labelStyle: [{ color: "#fff" } as TextStyle, item.labelStyle],
    }));
  }, [pickerProps.items]);

  const topBarProps: ModalTopBarProps = React.useMemo(() => {
    const incoming = pickerProps.topBarProps;
    return {
      ...incoming,
      cancelButtonProps: {
        color: "#fff",
        ...incoming?.cancelButtonProps,
        iconStyle: [{ tintColor: "#fff" }, incoming?.cancelButtonProps?.iconStyle],
        labelStyle: [{ color: "#fff" }, incoming?.cancelButtonProps?.labelStyle],
      },
    };
  }, [pickerProps.topBarProps]);

  const renderItem = React.useCallback<NonNullable<PickerProps["renderItem"]>>(
    (value, itemProps, label) => {
      if (userRenderItem) {
        return userRenderItem(value, itemProps, label);
      }

      const p = itemProps as {
        isSelected: boolean;
        isItemDisabled: boolean;
        label?: string;
        labelStyle?: TextStyle;
        selectedIcon?: number;
        selectedIconColor?: string;
      };
      const { isSelected, isItemDisabled, label: itemLabel, labelStyle, selectedIcon, selectedIconColor } = p;

      const textLabel = label ?? itemLabel;
      const selectedIndicator = isSelected ? (
        <Image
          source={selectedIcon ?? Assets.internal.icons.check}
          tintColor={isItemDisabled ? "#9CA3AF" : selectedIconColor || theme.color.primary}
        />
      ) : null;

      return (
        <View
          style={{
            height: 56.5,
            paddingHorizontal: 23,
            borderColor: "#000",
            borderBottomWidth: 1,
          }}
          flex
          row
          spread
          centerV
        >
          <Text numberOfLines={1} style={[{ flex: 1, textAlign: "left" }, labelStyle]}>
            {String(textLabel ?? "")}
          </Text>
          {selectedIndicator}
        </View>
      );
    },
    [userRenderItem]
  );

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
        <View absR style={{ right: scale(10), ...iconStyle }}>
          <Icon
            vector="Entypo"
            name={iconName ? iconName : "chevron-down"}
            color={iconColor ? iconColor : theme.color.gray}
            size={20}
          />
        </View>
      }
      {...pickerProps}
      items={items}
      topBarProps={topBarProps}
      renderItem={renderItem}
      labelProps={{
        medium: true,
        small: true,
        color: isDark ? "#fff" : theme.color.gray,
        "marginB-10": true,
        ...pickerProps.labelProps,
      }}
      fieldStyle={{
        backgroundColor: theme.color.inputBg,
        borderRadius: 30,
        paddingHorizontal: "6%",
        ...pickerProps?.fieldStyle,
      }}
      floatingPlaceholderStyle={{
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        fontFamily: theme.font.regular,
        ...pickerProps?.floatingPlaceholderStyle,
      }}
    />
  );
};

export default PickerC;
