import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const EVENT_HISTORY = [
    {
        id: "1",
        title: "Sunset Soundscapes: An Evening of Eclectic...",
        location: "Millennium Park, Chicago, IL",
        dateRange: "Start Tomorrow: 4–6 hrs",
        status: "fully Staffed" as const,
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
        statusColor: "#22C55E",
    },
    {
        id: "2",
        title: "Sunset Soundscapes: An Evening of Eclectic...",
        location: "Millennium Park, Chicago, IL",
        dateRange: "Start Tomorrow: 4–6 hrs",
        status: "fully Staffed" as const,
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2930&auto=format&fit=crop",
        statusColor: "#22C55E",
    },
];

const Home = () => {
    const [activeTab, setActiveTab] = React.useState<"available" | "active">("available");

    // Temporary split for UI: reuse the same mock requests for both tabs.
    const filteredEvents =
        activeTab === "available" ? EVENT_HISTORY : [...EVENT_HISTORY].reverse();

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{
                style: {
                    paddingBottom: 20,
                    paddingTop: 16,
                    paddingHorizontal: "5%",
                },
            }}
        >
            {/* Header: user icon + location (same layout as customer home) */}
            <View row spread centerV>
                <TouchableOpacity
                    row
                    centerV
                    paddingH-14
                    paddingV-10
                    style={{
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(25),
                    }}
                    onPress={() => router.push("/chooseLocation")}
                >
                    <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
                    <Text semibold small marginL-8 style={{ color: "#fff" }}>
                        Chenango, New York
                    </Text>
                    <Icon vector="Ionicons" name="chevron-down" size={18} color="#818898" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        width: moderateScale(44),
                        height: moderateScale(44),
                        borderRadius: moderateScale(22),
                        overflow: "hidden",
                    }}
                    onPress={() => router.push("/profile")}
                >
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3087&auto=format&fit=crop",
                        }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>

            {/* Main Heading */}
            <Text bold large32 marginT-20 style={{ color: "#fff", lineHeight: moderateScale(40) }}>
                Hi Jonathan 👋
            </Text>

            {/* 2 Tabs */}
            <View row style={{ marginTop: 18 }}>
                <TouchableOpacity
                    flex
                    center
                    paddingV-12
                    style={{
                        borderRadius: moderateScale(15),
                        backgroundColor: activeTab === "available" ? "#109CD9" : "#1E1E1E",
                        marginRight: 10,
                    }}
                    onPress={() => setActiveTab("available")}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Available Jobs
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    flex
                    center
                    paddingV-12
                    style={{
                        borderRadius: moderateScale(15),
                        backgroundColor: activeTab === "active" ? "#109CD9" : "#1E1E1E",
                        marginLeft: 10,
                    }}
                    onPress={() => setActiveTab("active")}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Active Jobs
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Events Listing */}
            <View marginT-20>
                {filteredEvents.map((event) => (
                    <TouchableOpacity
                        key={event.id}
                        marginB-16
                        style={{
                            backgroundColor: "#1E1E1E",
                            borderRadius: moderateScale(18),
                            overflow: "hidden",
                        }}
                        onPress={() =>
                            router.push({
                                pathname: "/(main)/(provider)/providerEventDetail",
                            })
                        }
                    >
                        <View style={{ position: "relative" }}>
                            <Image
                                source={{ uri: event.image }}
                                style={{ width: "100%", height: moderateScale(180) }}
                                resizeMode="cover"
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    top: moderateScale(12),
                                    right: moderateScale(12),
                                    paddingHorizontal: moderateScale(12),
                                    paddingVertical: moderateScale(6),
                                    borderRadius: moderateScale(20),
                                    backgroundColor: event.statusColor,
                                }}
                            >
                                <Text semibold extraSmall style={{ color: "#fff" }}>
                                    {event.status}
                                </Text>
                            </View>
                        </View>

                        <View padding-16>
                            <Text bold medium numberOfLines={2} style={{ color: "#fff" }}>
                                {event.title}
                            </Text>

                            <View row centerV marginT-8>
                                <Icon
                                    vector="Ionicons"
                                    name="location"
                                    size={16}
                                    color={theme.color.primary}
                                />
                                <Text small regular style={{ color: "#818898", marginLeft: 6 }}>
                                    {event.location}
                                </Text>
                            </View>

                            <View row centerV marginT-10>
                                <Icon vector="Ionicons" name="time-outline" size={16} color={theme.color.primary} />
                                <Text small regular style={{ color: "#818898", marginLeft: 6 }}>
                                    {event.dateRange}
                                </Text>
                            </View>

                            <View marginT-16>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.color.primary,
                                        borderRadius: moderateScale(14),
                                        paddingVertical: 12,
                                        alignItems: "center",
                                    }}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/(main)/(provider)/providerEventDetail",
                                        })
                                    }
                                >
                                    <Text semibold style={{ color: "#fff" }}>
                                        View Details
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Container>
    );
};

export default Home;
