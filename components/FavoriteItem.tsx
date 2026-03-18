import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";
import Icon from "./Icon";

interface FavoriteItemProps {
    image: any;
    title: string;
    price: string;
    rating: string;
    reviews: string;
    providerName: string;
    providerAvatar: string;
    providerRole: string;
}

const FavoriteItem = ({
    image,
    title,
    price,
    rating,
    reviews,
    providerName,
    providerAvatar,
    providerRole,
}: FavoriteItemProps) => {
    return (
        <View
            bg-inputBg
            br50
            marginB-20
            style={{
                shadowColor: theme.color.gray,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                overflow: 'hidden'
            }}
        >
            {/* Hero Image */}
            <Image
                source={image}
                style={{ width: '100%' }}
                height={moderateScale(180)}
                resizeMode="cover"
            />

            {/* Content Section */}
            <View padding-15>
                <View row spread centerV>
                    <Text black semibold small flex marginR-10>
                        {title}
                    </Text>
                    <View bg-secondary paddingV-5 paddingH-10 br100>
                        <Text white semibold extraSmall>
                            {price}
                        </Text>
                    </View>
                </View>

                {/* Rating */}
                <View row centerV marginT-5>
                    <Icon vector="Octicons" name="star-fill" size={16} color={theme.color.accent} />
                    <Text black regular extraSmall marginL-5>
                        {rating}
                    </Text>
                    <Text gray regular extraSmall marginL-2>
                        ({reviews})
                    </Text>
                </View>

                {/* Provider Info */}
                <View row centerV marginT-15>
                    <View br100 style={{ overflow: 'hidden' }}>
                        <Image
                            source={{ uri: providerAvatar }}
                            width={moderateScale(40)}
                            height={moderateScale(40)}
                        />
                    </View>
                    <View marginL-10>
                        <Text black semibold small>
                            {providerName}
                        </Text>
                        <Text gray regular extraSmall>
                            {providerRole}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default FavoriteItem;
