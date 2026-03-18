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
    status: "Completed" as const,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Sunset Soundscapes: An Evening of Eclectic...",
    location: "Millennium Park, Chicago, IL",
    status: "Waiting" as const,
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2930&auto=format&fit=crop",
  },
];

const MyEvents = () => {
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
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <View row centerV>
        <View width={moderateScale(44)} />
        <View flex center>
          <Text semibold regularSize style={{ color: "#fff" }}>
            My Events
          </Text>
        </View>
        <View width={moderateScale(44)} />
      </View>

      <View marginT-16>
        {EVENT_HISTORY.map((event) => (
          <TouchableOpacity
            key={event.id}
            marginB-16
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
              overflow: "hidden",
            }}
            onPress={() => router.push("/eventDetail")}
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
                  backgroundColor:
                    event.status === "Completed" ? "#22C55E" : "#8B7FC7",
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
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Container>
  );
};

export default MyEvents;

