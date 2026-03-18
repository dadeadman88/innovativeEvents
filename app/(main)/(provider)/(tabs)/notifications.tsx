import Container from "@/components/Container";
import * as React from "react";
import { FlatList } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";

type NotificationItem = {
    id: string;
    title: string;
    body: string;
    time: string;
    avatar: any;
};

const TODAY: NotificationItem[] = [
    {
        id: "t1",
        title: "Notifications",
        body: "Lorem ipsum dolor sit amet consectetur. Faucibus viverra ante amet elementum pretium. Sapien id lobortis venenatis ph...",
        time: "08:23 AM",
        avatar: { uri: "https://i.pravatar.cc/100?img=12" },
    },
    {
        id: "t2",
        title: "Notifications",
        body: "Lorem ipsum dolor sit amet consectetur. Faucibus viverra ante amet elementum pretium. Sapien id lobortis venenatis ph...",
        time: "08:23 AM",
        avatar: { uri: "https://i.pravatar.cc/100?img=32" },
    },
    {
        id: "t3",
        title: "Notifications",
        body: "Lorem ipsum dolor sit amet consectetur. Faucibus viverra ante amet elementum pretium. Sapien id lobortis venenatis ph...",
        time: "08:23 AM",
        avatar: { uri: "https://i.pravatar.cc/100?img=12" },
    },
];

const YESTERDAY: NotificationItem[] = [
    {
        id: "y1",
        title: "Notifications",
        body: "Lorem ipsum dolor sit amet consectetur. Faucibus viverra ante amet elementum pretium. Sapien id lobortis venenatis ph...",
        time: "08:23 AM",
        avatar: { uri: "https://i.pravatar.cc/100?img=12" },
    },
];

const Row = ({ item, showDivider }: { item: NotificationItem; showDivider: boolean }) => {
    return (
        <View>
            <View row paddingV-14>
                <Image
                    source={item.avatar}
                    style={{
                        width: moderateScale(44),
                        height: moderateScale(44),
                        borderRadius: moderateScale(22),
                    }}
                />
                <View flex marginL-12>
                    <View row spread>
                        <Text semibold regularSize style={{ color: "#fff" }}>
                            {item.title}
                        </Text>
                        <Text extraSmall regular style={{ color: "#818898" }}>
                            {item.time}
                        </Text>
                    </View>
                    <Text
                        marginT-6
                        small
                        regular
                        numberOfLines={2}
                        style={{ color: "#818898", lineHeight: moderateScale(18) }}
                    >
                        {item.body}
                    </Text>
                </View>
            </View>
            {showDivider ? (
                <View style={{ height: 1, backgroundColor: "#2A2A2A" }} />
            ) : null}
        </View>
    );
};

const Notifications = () => {
    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{
                style: {
                    paddingTop: 16,
                    paddingHorizontal: "6%",
                    paddingBottom: "4%",
                },
            }}
        >
            {/* Centered title (tab screen, no back) */}
            <View row centerV>
                <View width={moderateScale(44)} />
                <View flex center>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        Notifications
                    </Text>
                </View>
                <View width={moderateScale(44)} />
            </View>

            <FlatList
                data={[{ key: "today" }, { key: "yesterday" }] as any}
                keyExtractor={(i: any) => i.key}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: moderateScale(18),
                    paddingBottom: moderateScale(24),
                }}
                renderItem={({ item }: any) => {
                    if (item.key === "today") {
                        return (
                            <View>
                                <Text bold large20 style={{ color: "#fff" }}>
                                    Today
                                </Text>
                                <View marginT-12>
                                    {TODAY.map((n, idx) => (
                                        <Row key={n.id} item={n} showDivider={idx !== TODAY.length - 1} />
                                    ))}
                                </View>
                            </View>
                        );
                    }
                    return (
                        <View marginT-28>
                            <Text bold large20 style={{ color: "#fff" }}>
                                Yesterday
                            </Text>
                            <View marginT-12>
                                {YESTERDAY.map((n, idx) => (
                                    <Row key={n.id} item={n} showDivider={idx !== YESTERDAY.length - 1} />
                                ))}
                            </View>
                        </View>
                    );
                }}
            />
        </Container>
    );
};

export default Notifications;

