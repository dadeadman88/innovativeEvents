import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import { SCREEN_WIDTH } from "@/utils/constants";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";

const PaymentSuccess = () => {

    const { title, description } = useLocalSearchParams();

    return (
        <Container appBar appBarTitle="" scrollEnabled={false}>
            <View flex center>
                <Image
                    source={require("@/assets/images/success.png")}
                    width={SCREEN_WIDTH * 0.8}
                    height={SCREEN_WIDTH * 0.8}
                    resizeMode="contain"
                />

                <Text black bold large24 center marginT-20>
                    {title}
                </Text>

                <Text lightGray medium regularSize center marginT-10>
                    {description}
                </Text>
            </View>
            <CustomButton
                label="Done"
                onPress={() => router.back()}
                style={{ marginBottom: moderateScale(20) }}
            />
        </Container>
    );
};

export default PaymentSuccess;
