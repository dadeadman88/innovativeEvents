import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { theme } from "@/utils/designSystem";
import * as React from "react";
import { FlatList } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const NOTIFICATIONS_DATA = [
    {
        id: "1",
        title: "Account Signup Successfully",
        description: "Your account has been successful. You can use this application.",
        date: "05 Jan 2023",
        time: "10:00 AM",
        icon: "person-outline",
    },
    {
        id: "2",
        title: "Password Updated",
        description: "Your password is updated. You have got a new password.",
        date: "05 Jan 2023",
        time: "10:00 AM",
        icon: "lock-closed-outline",
    },
    {
        id: "3",
        title: "Security Updates",
        description: "Customers must have a current Technical Support agreement in order to be entitled...",
        date: "05 Jan 2023",
        time: "10:00 AM",
        icon: "shield-checkmark-outline",
    },
    {
        id: "4",
        title: "Ac repair booking",
        description: "Congratulation your car repair booking is successful",
        date: "05 Jan 2023",
        time: "10:00 AM",
        icon: "snow-outline",
    },
];

const Notifications = () => {
    const renderItem = ({ item }: { item: typeof NOTIFICATIONS_DATA[0] }) => (
        <View row paddingV-20 centerV>
            <View
                width={moderateScale(48)}
                height={moderateScale(48)}
                br100
                bg-grayBackground
                center
            >
                <Icon vector="Ionicons" name={item.icon} size={24} color={theme.color.secondary} />
            </View>
            <View flex marginL-15>
                <Text black semibold mediumSize>
                    {item.title}
                </Text>
                <Text gray regular extraSmall>
                    {item.description}
                </Text>
                <View row marginT-5 centerV>
                    <Text lightGray regular extraVSmall>
                        {item.date}
                    </Text>
                    <View width={1} height={10} bg-lightGray marginH-10 />
                    <Text lightGray regular extraVSmall>
                        {item.time}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <Container appBar appBarTitle="Notifications" scrollEnabled={false}>
            <FlatList
                data={NOTIFICATIONS_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View height={1} bg-inputBorder />}
                contentContainerStyle={{
                    paddingBottom: moderateScale(40),
                }}
            />
        </Container>
    );
};

export default Notifications;
