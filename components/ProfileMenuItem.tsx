import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Switch, Text, TouchableOpacity, View } from "react-native-ui-lib";
import Icon from "./Icon";

interface ProfileMenuItemProps {
    icon: string;
    label: string;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggleChange?: (value: boolean) => void;
    onPress?: () => void;
}

const ProfileMenuItem = ({
    icon,
    label,
    showToggle = false,
    toggleValue = false,
    onToggleChange,
    onPress,
}: ProfileMenuItemProps) => {
    return (
        <TouchableOpacity
            row
            spread
            centerV
            paddingV-15
            paddingH-5
            onPress={onPress}
            disabled={showToggle}
        >
            <View row centerV>
                <View width={moderateScale(32)} center>
                    <Icon vector="Ionicons" name={icon} size={24} color={theme.color.black} />
                </View>
                <Text black regular small marginL-15>
                    {label}
                </Text>
            </View>

            {showToggle ? (
                <Switch
                    value={toggleValue}
                    onValueChange={onToggleChange}
                    onColor={theme.color.accent}
                />
            ) : (
                <Icon vector="Ionicons" name="chevron-forward-outline" size={20} color={theme.color.gray} />
            )}
        </TouchableOpacity>
    );
};

export default ProfileMenuItem;
