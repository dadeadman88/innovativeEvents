import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
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
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Sunset Soundscapes: An Evening of Eclectic...",
    location: "Millennium Park, Chicago, IL",
    status: "Waiting" as const,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2930&auto=format&fit=crop",
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

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
      {/* Header: Location + Profile */}
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
            Chicago, US
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
        >
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text marginT-20 small regular style={{ color: "#818898" }}>
        Hello, Aaron 👋
      </Text>

      {/* Main Heading */}
      <Text bold large32 marginT-8 style={{ color: "#fff", lineHeight: moderateScale(40) }}>
        Let's find various events around you!
      </Text>

      {/* Search Events Button */}
      <View marginT-24>
        <TouchableOpacity
          row
          centerV
          paddingH-16
          paddingV-12
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: moderateScale(15),
          }}
          onPress={() => router.push("/(main)/(customer)/explore")}
        >
          <Icon vector="Feather" name="search" size={20} color="#818898" />
          <Text small regular style={{ color: "#818898", marginLeft: 10, flex: 1 }}>
            Search events
          </Text>
          <View
            style={{
              borderLeftWidth: 1,
              borderColor: "#3A3A3A",
              paddingLeft: 12,
            }}
          >
            <Image
              source={require("@/assets/images/filter-icon.png")}
              style={{ width: moderateScale(20), height: moderateScale(20) }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Event History Section */}
      <View row spread centerV marginT-32>
        <Text bold large20 style={{ color: "#fff" }}>
          Event History
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <Text semibold small style={{ color: theme.color.primary }}>
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Event Cards */}
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
                  backgroundColor: event.status === "Completed" ? "#22C55E" : "#8B7FC7",
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
                <Icon vector="Ionicons" name="location" size={16} color={theme.color.primary} />
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

export default Home;
