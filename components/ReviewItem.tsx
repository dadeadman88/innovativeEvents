import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";
import Icon from "./Icon";

interface ReviewItemProps {
    name: string;
    role: string;
    avatar: string;
    rating: string;
    comment: string;
}

const ReviewItem = ({ name, role, avatar, rating, comment }: ReviewItemProps) => {
    return (
        <View
            bg-inputBg
            br40
            padding-20
            marginB-15
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 5,
                elevation: 2,
            }}
        >
            <View row spread centerV>
                <View row centerV flex>
                    <Image
                        source={{ uri: avatar }}
                        width={moderateScale(40)}
                        height={moderateScale(40)}
                        style={{ borderRadius: moderateScale(20) }}
                    />
                    <View marginL-12>
                        <Text black semibold small>
                            {name}
                        </Text>
                        <Text gray regular extraSmall marginT-2>
                            {role}
                        </Text>
                    </View>
                </View>
                <View row centerV>
                    <Icon vector="Octicons" name="star-fill" size={18} color={theme.color.accent} />
                    <Text black bold regularSize marginL-4>
                        {rating}
                    </Text>
                </View>
            </View>
            <Text black regular small marginT-15 style={{ lineHeight: moderateScale(20) }}>
                “{comment}”
            </Text>
        </View>
    );
};

export default ReviewItem;
