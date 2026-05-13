import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import SuccessDialog from "@/components/SuccessDialog";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const StartJob = () => {
    const [checkoutSuccessVisible, setCheckoutSuccessVisible] = React.useState(false);
    const [tasks, setTasks] = React.useState([
        { id: "t1", label: "Safety equipment check-in", done: true, info: false },
        { id: "t2", label: "Equipment setup & power-on", done: true, info: false },
        { id: "t3", label: "Main unit internal cleaning", done: false, info: true },
        { id: "t4", label: "Filter replacement & testing", done: false, info: false },
        { id: "t5", label: "Exterior panel seal replacement", done: false, info: false },
    ]);

    const completedCount = tasks.filter((t) => t.done).length;
    const totalCount = tasks.length;
    const progress = totalCount === 0 ? 0 : completedCount / totalCount;

    const toggleTask = (id: string) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    };

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollProps={{ showsVerticalScrollIndicator: false }}
            containerProps={{
                style: {
                    paddingTop: 14,
                    paddingHorizontal: "6%",
                    paddingBottom: "10%",
                },
            }}
        >
            {/* Header */}
            <View row centerV style={{ paddingVertical: 6 }}>
                <View width={moderateScale(44)} />
                <View flex center>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        Job #4563
                    </Text>
                </View>
                <View width={moderateScale(44)} />
            </View>

            {/* Timer + Progress card */}
            <View
                marginT-18
                padding-16
                style={{
                    backgroundColor: "#1E1E1E",
                    borderRadius: moderateScale(18),
                }}
            >
                <Text extraSmall semibold style={{ color: "#818898", textAlign: "center" }}>
                    CURRENT SESSION TIME
                </Text>

                <View row centerH marginT-14 style={{ gap: moderateScale(10) }}>
                    {[
                        { value: "02", label: "Hours" },
                        { value: "45", label: "Minutes" },
                        { value: "12", label: "Seconds" },
                    ].map((b) => (
                        <View key={b.label} center style={{ width: moderateScale(78) }}>
                            <View
                                center
                                style={{
                                    width: "100%",
                                    paddingVertical: moderateScale(10),
                                    backgroundColor: "#0B0B0B",
                                    borderRadius: moderateScale(14),
                                }}
                            >
                                <Text bold large24 style={{ color: theme.color.primary }}>
                                    {b.value}
                                </Text>
                            </View>
                            <Text extraSmall regular marginT-8 style={{ color: "#818898" }}>
                                {b.label}
                            </Text>
                        </View>
                    ))}
                </View>

                <View row spread centerV marginT-18>
                    <Text semibold small style={{ color: "#fff" }}>
                        Job Checklist
                    </Text>
                    <Text extraSmall regular style={{ color: theme.color.primary }}>
                        {completedCount} of {totalCount} Completed
                    </Text>
                </View>

                <View
                    marginT-10
                    style={{
                        height: moderateScale(10),
                        borderRadius: moderateScale(20),
                        backgroundColor: "#2A2A2A",
                        overflow: "hidden",
                    }}
                >
                    <View
                        style={{
                            height: "100%",
                            width: `${Math.round(progress * 100)}%`,
                            backgroundColor: theme.color.primary,
                            borderRadius: moderateScale(20),
                        }}
                    />
                </View>
            </View>

            {/* Required tasks */}
            <Text marginT-24 bold large20 style={{ color: "#fff" }}>
                Required Tasks
            </Text>

            <View marginT-12 style={{ gap: moderateScale(12) }}>
                {tasks.map((t) => (
                    <TouchableOpacity
                        key={t.id}
                        row
                        centerV
                        activeOpacity={0.85}
                        onPress={() => toggleTask(t.id)}
                        style={{
                            backgroundColor: "#1E1E1E",
                            borderRadius: moderateScale(14),
                            paddingVertical: moderateScale(14),
                            paddingHorizontal: moderateScale(14),
                        }}
                    >
                        <View
                            center
                            style={{
                                width: moderateScale(22),
                                height: moderateScale(22),
                                borderRadius: moderateScale(6),
                                borderWidth: 2,
                                borderColor: t.done ? theme.color.primary : "#6C6C6C",
                                backgroundColor: t.done ? theme.color.primary : "transparent",
                            }}
                        >
                            {t.done ? (
                                <Icon vector="Ionicons" name="checkmark" size={14} color="#fff" />
                            ) : null}
                        </View>

                        <Text
                            flex
                            marginL-12
                            regular
                            style={{
                                color: t.done ? "#818898" : "#fff",
                                textDecorationLine: t.done ? "line-through" : "none",
                            }}
                        >
                            {t.label}
                        </Text>

                        {t.info ? (
                            <View
                                center
                                style={{
                                    width: moderateScale(22),
                                    height: moderateScale(22),
                                    borderRadius: moderateScale(11),
                                    borderWidth: 1,
                                    borderColor: "#6C6C6C",
                                }}
                            >
                                <Icon vector="Ionicons" name="information" size={14} color="#818898" />
                            </View>
                        ) : null}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Evidence & Forms */}
            <Text marginT-24 bold large20 style={{ color: "#fff" }}>
                Evidence & Forms
            </Text>

            <View row marginT-12 style={{ gap: moderateScale(12) }}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        height: moderateScale(110),
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(16),
                        borderStyle: "dashed",
                        borderWidth: 1.5,
                        borderColor: "#2A2A2A",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {}}
                >
                    <Icon vector="Ionicons" name="camera-outline" size={22} color={theme.color.primary} />
                    <Text marginT-8 semibold extraSmall style={{ color: "#818898" }}>
                        UPLOAD PHOTO
                    </Text>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                        height: moderateScale(110),
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(16),
                        overflow: "hidden",
                    }}
                >
                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2400&auto=format&fit=crop" }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </View>
            </View>

            <View row marginT-14 style={{ gap: moderateScale(12) }}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(14),
                        paddingVertical: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onPress={() => router.push("/(main)/(provider)/chatScreen?name=Group%20Chat")}
                >
                    <Icon vector="Ionicons" name="chatbubble-ellipses-outline" size={18} color="#fff" />
                    <Text semibold style={{ color: "#fff" }}>
                        Group Chat
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: moderateScale(14),
                        paddingVertical: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onPress={() => {}}
                >
                    <Icon vector="Ionicons" name="document-text-outline" size={18} color="#000" />
                    <Text semibold style={{ color: "#000" }}>
                        Completion Form
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Check-Out */}
            <View marginT-20>
                <CustomButton
                    label="Check-Out"
                    onPress={() => setCheckoutSuccessVisible(true)}
                    backgroundColor="#EF4444"
                    iconSource={require("@/assets/images/logout.png")}
                    iconStyle={{
                        width: moderateScale(18),
                        height: moderateScale(18),
                        tintColor: "#fff",
                        marginRight: moderateScale(8),
                    } as any}
                />
            </View>

            <SuccessDialog
                visible={checkoutSuccessVisible}
                onDismiss={() => setCheckoutSuccessVisible(false)}
                title="Job done successfully"
                buttonLabel="OK"
                onButtonPress={() => {
                    setCheckoutSuccessVisible(false);
                    router.replace("/(main)/(provider)/(tabs)/home");
                }}
            />
        </Container>
    );
};

export default StartJob;
