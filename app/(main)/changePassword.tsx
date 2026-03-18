import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import * as React from "react";
import { Text, View } from "react-native-ui-lib";

const ChangePassword = () => {
    return (
        <Container appBar appBarTitle="Change Password">
            <View marginT-20>
                <Text black regular large>
                    The new password must be different from the current password
                </Text>
            </View>

            <View marginT-30>
                <Input
                    label="Old Password"
                    placeholder="••••••••"
                    secureTextEntry
                />
                <View marginV-10 />
                <Input
                    label="New Password"
                    placeholder="••••••••"
                    secureTextEntry
                />
                <View marginV-10 />
                <Input
                    label="Confirm Password"
                    placeholder="••••••••"
                    secureTextEntry
                />
            </View>

            <View marginT-40 paddingB-40>
                <CustomButton
                    label="Submit"
                    onPress={() => { }}
                />
            </View>
        </Container>
    );
};

export default ChangePassword;
