import Container from "@/components/Container";
import { router } from "expo-router";
import * as React from "react";
import { FlatList } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const Chat = () => {
    const [activeTab, setActiveTab] = React.useState<"private" | "group">("private");

    type ChatItem = {
        id: string;
        title: string;
        preview: string;
        time: string;
        avatar: any;
    };

    const PRIVATE_CHATS: ChatItem[] = [
        {
            id: "p1",
            title: "Fedor Kiryakov",
            preview: "Cleaning Services, Hello Fedor Kiryakov...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=47" },
        },
        {
            id: "p2",
            title: "Bane Cooper",
            preview: "Car Repair Service, Hello Bane Cooper...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=8" },
        },
        {
            id: "p3",
            title: "Oleg Chapchay",
            preview: "Cleaning Service, Hello Oleg Chapchay...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=18" },
        },
        {
            id: "p4",
            title: "Devon Lane",
            preview: "Fridge Repair Service, Hello Devon Lane...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=32" },
        },
        {
            id: "p5",
            title: "Muhammad",
            preview: "Car Repair Service, Hello Muhammad...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=55" },
        },
        {
            id: "p6",
            title: "Jane Cooper",
            preview: "AC Repair Service, Hello Jane Cooper...",
            time: "17 Feb 2026",
            avatar: { uri: "https://i.pravatar.cc/100?img=12" },
        },
    ];

    const GROUP_CHATS: ChatItem[] = [];

    const activeChats = activeTab === "private" ? PRIVATE_CHATS : GROUP_CHATS;

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{
                style: {
                    paddingHorizontal: "6%",
                    paddingBottom: "4%",
                    paddingTop: 22,
                },
            }}
        >
            {/* Centered title like Notifications screen */}
            <View row centerV marginT-10 marginB-10>
                <View width={moderateScale(44)} />
                <View flex center>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        Chats
                    </Text>
                </View>
                <View width={moderateScale(44)} />
            </View>

            {/* Tabs (Private / Group) hidden for now — single listing only.
                Uncomment to bring back tab switching. */}
            {/*
            <View row style={{ marginTop: 10 }}>
                <TouchableOpacity
                    flex
                    center
                    paddingV-12
                    style={{
                        borderRadius: moderateScale(15),
                        backgroundColor: activeTab === "private" ? "#109CD9" : "#1E1E1E",
                        marginRight: 10,
                    }}
                    onPress={() => setActiveTab("private")}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Private chat
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    flex
                    center
                    paddingV-12
                    style={{
                        borderRadius: moderateScale(15),
                        backgroundColor: activeTab === "group" ? "#109CD9" : "#1E1E1E",
                        marginLeft: 10,
                    }}
                    onPress={() => setActiveTab("group")}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Group Chat
                    </Text>
                </TouchableOpacity>
            </View>
            */}

            {/* List */}
            <View style={{ marginTop: 18, flex: 1 }}>
                <FlatList
                    data={activeChats}
                    keyExtractor={(i) => i.id}
                    showsVerticalScrollIndicator={false}
                    // flexGrow: 1 so the ListEmptyComponent can use the
                    // full available height and vertically center itself.
                    contentContainerStyle={
                        activeChats.length === 0
                            ? { flexGrow: 1, justifyContent: "center", alignItems: "center" }
                            : undefined
                    }
                    ListEmptyComponent={
                        <View center paddingH-24>
                            <Text semibold regularSize style={{ color: "#fff" }}>
                                No chats found
                            </Text>
                            <Text
                                small
                                regular
                                center
                                marginT-6
                                style={{ color: "#818898" }}
                            >
                                You don't have any conversations yet.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }: { item: ChatItem }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push({
                                    pathname: "/(main)/(provider)/chatScreen",
                                    params: {
                                        name: item.title,
                                        avatar:
                                            item?.avatar && typeof item.avatar === "object"
                                                ? (item.avatar as any).uri
                                                : typeof item.avatar === "string"
                                                    ? item.avatar
                                                    : undefined,
                                    },
                                })
                            }
                            style={{ paddingVertical: 14 }}
                        >
                            <View row centerV>
                                <Image
                                    source={item.avatar}
                                    style={{
                                        width: moderateScale(44),
                                        height: moderateScale(44),
                                        borderRadius: moderateScale(22),
                                    }}
                                />
                                <View flex marginL-14>
                                    <View row spread>
                                        <Text semibold regularSize style={{ color: "#fff" }}>
                                            {item.title}
                                        </Text>
                                        <Text extraSmall regular style={{ color: "#818898" }}>
                                            {item.time}
                                        </Text>
                                    </View>
                                    <Text small regular style={{ color: "#818898", marginTop: 6 }}>
                                        {item.preview}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ height: 1, backgroundColor: "#2A2A2A", marginTop: 14 }} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Container>
    );
};

export default Chat;

