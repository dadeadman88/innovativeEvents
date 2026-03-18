import Container from "@/components/Container";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import Icon from "@/components/Icon";
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

const ProviderEvents = () => {
    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollProps={{ showsVerticalScrollIndicator: false }}
            containerProps={{
                style: {
                    paddingTop: 16,
                    paddingHorizontal: "6%",
                    paddingBottom: "8%",
                },
            }}
        >
            <Text
                semibold
                large24
                style={{
                    color: "#fff",
                    textAlign: "center",
                    marginTop: 4,
                    marginBottom: 12,
                }}
            >
                My Events
            </Text>

            <View marginT-10>
                {EVENT_HISTORY.map((event) => (
                    <TouchableOpacity
                        key={event.id}
                        marginB-16
                        style={{
                            backgroundColor: "#1E1E1E",
                            borderRadius: moderateScale(18),
                            overflow: "hidden",
                        }}
                        onPress={() =>
                            router.push("/(main)/(provider)/providerEventDetail")
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
                                        router.push("/(main)/(provider)/providerEventDetail")
                                    }
                                >
                                    <Text semibold style={{ color: "#fff" }}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Container>
    );
};

export default ProviderEvents;
