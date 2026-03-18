import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Input from "@/components/Input";
import { theme } from "@/utils/designSystem";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

interface Message {
    id: string;
    text: string;
    isMe: boolean;
}

const DUMMY_MESSAGES: Message[] = [
    { id: "1", text: "Hi", isMe: true },
    { id: "2", text: "I need a plumber. Are you available?", isMe: true },
    { id: "3", text: "Yes available now, Please share your task details.", isMe: false },
    { id: "4", text: "I want to clean my house, it is possible?", isMe: true },
    { id: "5", text: "Yes, why not!", isMe: false },
    { id: "6", text: "Do you know my working process?", isMe: false },
    { id: "7", text: "Yes, I know", isMe: true },
    { id: "8", text: "Can I call you for some discus?", isMe: true },
    { id: "9", text: "Yes sure", isMe: false },
];

const MessageBubble = ({ message }: { message: Message }) => {
    return (
        <View
            marginV-6
            style={{ alignSelf: message.isMe ? "flex-end" : "flex-start" }}
        >
            <View
                padding-15
                br50
                backgroundColor={message.isMe ? theme.color.primary : theme.color.lightGray2}
                style={{ maxWidth: "80%", borderTopRightRadius: message.isMe ? 0 : 15, borderTopLeftRadius: message.isMe ? 15 : 0 }}
            >
                <Text
                    regular
                    small
                    color={message.isMe ? theme.color.white : theme.color.textColor}
                >
                    {message.text}
                </Text>
            </View>
        </View>
    );
};

const Chat = () => {
    const { name = "Fedor Kiryakov", avatar } = useLocalSearchParams();
    const resolvedAvatarSource = React.useMemo(() => {
        if (!avatar) return undefined;
        if (typeof avatar === "string") return { uri: avatar };
        if (typeof avatar === "object" && avatar !== null) {
            // When passed from chat list we store `{ uri: "..." }`
            if ("uri" in avatar && typeof (avatar as any).uri === "string") {
                return { uri: (avatar as any).uri };
            }
            return avatar as any;
        }
        return undefined;
    }, [avatar]);
    const [message, setMessage] = React.useState("");
    const [messages, setMessages] = React.useState<Message[]>(DUMMY_MESSAGES);
    const flatListRef = React.useRef<FlatList>(null);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message.trim(),
                isMe: true,
            };
            setMessages([...messages, newMessage]);
            setMessage("");
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <MessageBubble message={item} />
    );

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollEnabled={false}
            containerProps={{ style: { paddingTop: 16, paddingHorizontal: "6%", paddingBottom: "4%" } }}
        >
            {/* Header: back + title + profile picture */}
            <View
                row
                centerV
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    alignItems: "center",
                }}
            >
                <BackButton style={{ marginBottom: 0, width: moderateScale(44), height: moderateScale(44) }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text semibold regularSize style={{ color: "#fff" }}>   {name} </Text>
                </View>
                <View style={{ width: moderateScale(40) }}>
                    <View br100 style={{ overflow: "hidden" }}>
                        <Image
                            source={resolvedAvatarSource}
                            width={moderateScale(40)}
                            height={moderateScale(40)}
                        />
                    </View>
                </View>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={moderateScale(100)}
            >
                {/* Messages + fixed input */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingVertical: moderateScale(18),
                            paddingBottom: moderateScale(90),
                        }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    />

                    <View style={{ paddingHorizontal: "2%", paddingBottom: moderateScale(16) }}>
                        <Input
                            placeholder="Message"
                            value={message}
                            onChangeText={setMessage}
                            onSubmitEditing={handleSend}
                            fieldStyle={{
                                paddingHorizontal: "2%",
                                height: moderateScale(48),
                            }}
                            trailingAccessory={
                                <TouchableOpacity
                                    bg-accent
                                    br100
                                    padding-12
                                    marginL-10
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        handleSend();
                                    }}
                                >
                                    <Image
                                        source={require("@/assets/images/Send.png")}
                                        width={moderateScale(20)}
                                        height={moderateScale(20)}
                                    />
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default Chat;
