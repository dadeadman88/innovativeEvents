import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import CustomButton from "./Button";
import Icon from "./Icon";

export type BookingStatus = "Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled";

interface BookingItemProps {
    id: string;
    referenceCode: string;
    providerName: string;
    category: string;
    price: string;
    image: string;
    status: BookingStatus;
    date: string;
    time: string;
    isProvider?: boolean;
    onDetailPress?: () => void;
    onViewBidsPress?: () => void;
}

const BookingItem = ({
    referenceCode,
    providerName,
    category,
    price,
    image,
    status,
    date,
    time,
    isProvider = false,
    onDetailPress,
    onViewBidsPress,
}: BookingItemProps) => {
    const getStatusColor = () => {
        switch (status) {
            case "Pending":
                return "#FFEBEE"; // Light red tint
            case "Accepted":
                return "#E3F2FD"; // Light blue tint
            case "In Progress":
                return "#E3F2FD"; // Light blue tint
            case "Completed":
                return "#E8F5E9"; // Light green tint
            case "Cancelled":
                return "#FFEBEE"; // Light red tint
            default:
                return "#F5F5F5";
        }
    };

    const getStatusTextColor = () => {
        switch (status) {
            case "Pending":
                return theme.color.secondary;
            case "Accepted":
                return theme.color.accent;
            case "In Progress":
                return theme.color.accent;
            case "Completed":
                return "#4CAF50";
            case "Cancelled":
                return theme.color.secondary; // Red
            default:
                return theme.color.gray;
        }
    };

    return (
        <TouchableOpacity
            bg-white
            br60
            padding-20
            marginB-20
            onPress={() => {
                onDetailPress?.();

            }}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 5,
                borderWidth: 1,
                borderColor: "#F0F0F0",
            }}
        >
            {/* Header: Reference Code */}
            <View row spread centerV>
                <Text gray regular extraSmall12>
                    Reference Code
                </Text>
                <Text black bold extraSmall12>
                    {referenceCode}
                </Text>
            </View>

            {/* Provider Info */}
            <View row marginT-15 centerV>
                <View br40 style={{ overflow: "hidden" }}>
                    <Image
                        source={{ uri: image }}
                        width={moderateScale(80)}
                        height={moderateScale(80)}
                    />
                </View>
                <View marginL-12 flex>
                    <Text black semibold mediumSize>
                        {providerName}
                    </Text>
                    <Text gray regular small marginT-2>
                        {category}
                    </Text>
                    <View row centerV marginT-8>
                        <Text secondary bold regularSize>
                            {price}
                        </Text>
                        <Text gray regular extraSmall12>
                            /hour
                        </Text>
                    </View>
                </View>
            </View>

            <View
                marginV-15
                style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
            />

            {/* Status Section */}
            <View row spread centerV>
                <Text gray regular small>
                    {isProvider ? "Appointment" : "Status"}
                </Text>
                <View
                    paddingH-12
                    paddingV-6
                    br100
                    style={{ backgroundColor: getStatusColor() }}
                >
                    <Text style={{ color: getStatusTextColor() }} semibold extraSmall12>
                        {status}
                    </Text>
                </View>
            </View>

            {/* Schedule Section */}
            <View row marginT-15 centerV>
                <View
                    width={moderateScale(40)}
                    height={moderateScale(40)}
                    br100
                    center
                    style={{ borderWidth: 1, borderColor: theme.color.accent }}
                >
                    <Icon vector="Ionicons" name="calendar-outline" size={20} color={theme.color.accent} />
                </View>
                <View marginL-12>
                    <Text black regular small>
                        {time}, {date}
                    </Text>
                    <Text gray regular extraSmall12>
                        Schedule
                    </Text>
                </View>
            </View>

            {
                isProvider && (
                    <View
                        marginV-15
                        style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
                    />
                )
            }

            {
                isProvider && (
                    <View row centerV>
                        <Image source={require("@/assets/images/bidCheck.png")} width={moderateScale(40)} height={moderateScale(40)} />
                        <View marginL-10>
                            <Text gray regular extraSmall12>You bid price</Text>
                            <Text secondary bold regularSize marginT-4>$30.00<Text regular small gray>/hour</Text></Text>
                        </View>
                    </View>
                )
            }

            {/* Action Buttons (Conditional) */}
            {status === "Pending" && !isProvider && (
                <View row marginT-20 gap-12>
                    <CustomButton
                        shadow={false}
                        label="Details"
                        flex
                        variant="secondary"
                        outlineColor={theme.color.black}
                        color={theme.color.black}
                        onPress={() => {
                            onDetailPress?.();
                        }}
                        style={{ height: moderateScale(43) }}
                    />
                    <CustomButton
                        shadow={false}
                        label="View Bids"
                        flex
                        onPress={() => {
                            onViewBidsPress?.();
                            // Deprecated screen: /allBids
                            // Use the closest replacement screen.
                            router.push("/myEvents");
                        }}
                        style={{ height: moderateScale(43) }}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default BookingItem;
