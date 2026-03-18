import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";
import CustomButton from "./Button";

interface RecentRequestItemProps {
    id: string;
    serviceName: string;
    bookingId: string;
    price: string;
    image: any; // Allow require() or uri
    date: string;
    time: string;
    userName: string;
    onDetailPress?: () => void;
}

const RecentRequestItem = ({
    serviceName,
    bookingId,
    price,
    image,
    date,
    time,
    userName,
    onDetailPress,
}: RecentRequestItemProps) => {
    return (
        <View
            bg-inputBg
            br40
            padding-20
            marginB-20
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}
        >
            {/* Header Section */}
            <View row spread>
                <View row flex>
                    <Image
                        source={typeof image === 'string' ? { uri: image } : image}
                        width={moderateScale(70)}
                        height={moderateScale(70)}
                        style={{ borderRadius: moderateScale(12) }}
                    />
                    <View marginL-12 flex>
                        <Text black semibold regularSize numberOfLines={1}>
                            {serviceName}
                        </Text>
                        <Text gray regular extraSmall12 marginT-4>
                            Booking ID: {bookingId}
                        </Text>
                        <Text secondary semibold regularSize marginT-6>
                            {price}
                        </Text>
                    </View>
                </View>

                {/* View Detail Button */}
                <View>
                    <CustomButton
                        label="View Detail"
                        onPress={onDetailPress}
                        backgroundColor={theme.color.accent}
                        style={{
                            height: moderateScale(35),
                        }}
                        labelStyle={{ fontSize: moderateScale(12), fontFamily: theme.font.semibold }}
                    />
                </View>
            </View>

            {/* Info Card */}
            <View
                bg-white
                br60
                marginT-15
                padding-15
            >
                {/* Date & Time */}
                <View row spread centerV>
                    <Text darkGray regular small>
                        Date & Time
                    </Text>
                    <Text black semibold small>
                        {date}, {time}
                    </Text>
                </View>

                <View
                    marginV-12
                    style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
                />

                {/* User */}
                <View row spread centerV>
                    <Text darkGray regular small>
                        User
                    </Text>
                    <Text accent semibold small>
                        {userName}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default RecentRequestItem;
