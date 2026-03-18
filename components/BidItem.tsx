import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import CustomButton from "./Button";
import Icon from "./Icon";

interface BidItemProps {
    id: string;
    providerName: string;
    providerRole: string;
    rating: string;
    reviewCount: string;
    avatar: string;
    bidAmount: string;
    arrivalTime: string;
    tax?: string;
    platformFee?: string;
    extended?: boolean;
    showChat?: boolean;
    marginT?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
    onChat?: () => void;
}

const BidItem = ({
    providerName,
    providerRole,
    rating,
    reviewCount,
    avatar,
    bidAmount,
    arrivalTime,
    tax = "$4.00",
    platformFee = "$4.00",
    extended = false,
    showChat = false,
    marginT = false,
    onAccept,
    onReject,
    onChat,
}: BidItemProps) => {
    return (
        <View
            bg-inputBg
            br40
            padding-20
            marginB-20
            marginT-25={marginT}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}
        >
            {/* Provider Header */}
            <View row spread centerV>
                <View row centerV flex>
                    <Image
                        source={{ uri: avatar }}
                        width={moderateScale(70)}
                        height={moderateScale(70)}
                        style={{ borderRadius: moderateScale(35) }}
                    />
                    <View marginL-12 flex>
                        <Text black semibold regularSize>
                            {providerName}
                        </Text>
                        <View row centerV marginV-4>
                            <Icon vector="Octicons" name="star-fill" size={16} color={theme.color.accent} />
                            <Text black semibold extraSmall marginL-4>
                                {rating}
                            </Text>
                            <Text gray regular style={{ fontSize: moderateScale(13) }} marginL-2>
                                ({reviewCount} review)
                            </Text>
                        </View>
                        <Text accent semibold extraSmall>
                            {providerRole}
                        </Text>
                    </View>
                </View>

                {showChat && (
                    <TouchableOpacity
                        row
                        centerV
                        onPress={onChat}
                        bg-accent
                        paddingH-12
                        paddingV-8
                        style={{ borderRadius: moderateScale(10) }}
                    >
                        <Icon vector="Ionicons" name="chatbubble-ellipses" size={16} color="white" />
                        <Text white semibold marginL-6 style={{ fontSize: moderateScale(12) }}>
                            Chat
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Bid Info Card */}
            <View
                bg-white
                br60
                marginT-20
                padding-15
            >
                <View row spread centerV>
                    <Text darkGray semibold extraSmall>
                        {extended ? "Time of arrival:" : "Bid Amount"}
                    </Text>
                    {extended ? (
                        <Text darkGray semibold extraSmall uppercase>
                            {arrivalTime}
                        </Text>
                    ) : (
                        <View row centerV>
                            <Text secondary semibold regularSize>
                                {bidAmount}
                            </Text>
                            <Text darkGray regular small>
                                /hour
                            </Text>
                        </View>
                    )}
                </View>

                <View
                    marginV-12
                    style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
                />

                <View row spread centerV>
                    <Text darkGray semibold extraSmall>
                        {extended ? "Bid Amount:" : "Time of arrival"}
                    </Text>
                    {extended ? (
                        <View row centerV>
                            <Text secondary bold regularSize>
                                {bidAmount}
                            </Text>
                            <Text darkGray regular small>
                                /hour
                            </Text>
                        </View>
                    ) : (
                        <Text darkGray semibold extraSmall uppercase>
                            {arrivalTime}
                        </Text>
                    )}
                </View>

                {extended && (
                    <>
                        <View
                            marginV-12
                            style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
                        />
                        <View row spread centerV>
                            <Text darkGray semibold extraSmall>
                                Tax:
                            </Text>
                            <Text accent semibold extraSmall>
                                {tax}
                            </Text>
                        </View>
                        <View
                            marginV-12
                            style={{ borderStyle: "dashed", borderTopWidth: 1, borderColor: "#E0E0E0" }}
                        />
                        <View row spread centerV>
                            <Text darkGray semibold extraSmall>
                                10% Platform Fee:
                            </Text>
                            <Text accent semibold extraSmall>
                                {platformFee}
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/* Action Buttons (Hide if extended) */}
            {!extended && (
                <View row marginT-20 gap-12>
                    <CustomButton
                        shadow={false}
                        label="Accept"
                        backgroundColor={theme.color.accent}
                        flex
                        onPress={onAccept}
                        style={{ height: moderateScale(45) }}
                    />
                    <CustomButton
                        shadow={false}
                        label="Reject"
                        flex
                        onPress={onReject}
                        style={{ height: moderateScale(45) }}
                    />
                </View>
            )}
        </View>
    );
};

export default BidItem;
