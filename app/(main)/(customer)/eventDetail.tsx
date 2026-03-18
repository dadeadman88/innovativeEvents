import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const EventDetail = () => {
  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      containerProps={{ style: { paddingHorizontal: 0, paddingBottom: "4%" } }}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      {/* Hero */}
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
          }}
          style={{ width: "100%", height: moderateScale(220) }}
          resizeMode="cover"
        />

        {/* Header overlay */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            right: 0,
            paddingHorizontal: "6%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <BackButton style={{ marginBottom: 0, width: moderateScale(44), height: moderateScale(44) }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text semibold regularSize style={{ color: "#fff" }}>
              Event Details
            </Text>
          </View>
          <View style={{ width: moderateScale(44) }} />
        </View>
      </View>

      {/* Content */}
      <View style={{ paddingHorizontal: "6%" }}>
        <View marginT-20>
          <Text bold large24 style={{ color: "#fff" }}>
            Sunset Soundscapes: An Evening of Eclectic Music and City Lights
          </Text>

          <View row centerV marginT-10>
            <Icon vector="Ionicons" name="calendar-outline" size={18} color={theme.color.primary} />
            <Text small regular style={{ color: "#818898", marginLeft: 8 }}>
              Saturday, February 14, 2025 - 5.00 PM
            </Text>
          </View>
        </View>

        {/* About */}
        <View marginT-24>
          <Text bold large20 style={{ color: "#fff" }}>
            About this event
          </Text>
          <Text marginT-10 small regular style={{ color: "#818898", lineHeight: moderateScale(20) }}>
            Join us for a magical night at Sunset Soundscapes: An Evening of Eclectic Music and City Lights,
            where the heart of Chicago comes alive with the sounds of diverse musical talents. As the sun sets
            and the city lights up, immerse yourself in a rich blend of indie rock, electronic beats, and soulful
            acoustic tunes, all performed live in the stunning surroundings of Millennium Park.
          </Text>
        </View>

        {/* Location */}
        <View marginT-24>
          <Text bold large20 style={{ color: "#fff" }}>
            Location
          </Text>
          <View row centerV marginT-10>
            <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
            <View marginL-8 flex>
              <Text semibold small style={{ color: "#fff" }}>
                Millennium Park
              </Text>
              <Text extraSmall regular style={{ color: "#818898", marginTop: 2 }}>
                Polk Bros Park Performance Lawn, 600 E Grand Ave, C...
              </Text>
            </View>
          </View>

          <View
            marginT-12
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
              overflow: "hidden",
            }}
          >
            {/* Map placeholder image block */}
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2400&auto=format&fit=crop" }}
              style={{ width: "100%", height: moderateScale(120) }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Organized by */}
        <View marginT-24>
          <Text bold large20 style={{ color: "#fff" }}>
            Organized by
          </Text>
          <View
            marginT-12
            padding-16
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
            }}
          >
            <Text semibold small style={{ color: "#fff" }}>
              Chicago Harmony Productions
            </Text>
            <Text marginT-6 extraSmall regular style={{ color: "#818898" }}>
              text here
            </Text>
          </View>
        </View>

        {/* Documents */}
        <View marginT-24 marginB-30>
          <Text bold large20 style={{ color: "#fff" }}>
            Documents
          </Text>
          <TouchableOpacity
            marginT-12
            row
            centerV
            paddingH-16
            paddingV-14
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
            }}
            onPress={() => {}}
          >
            <Text small regular style={{ color: "#818898", flex: 1 }}>
              attach documents
            </Text>
            <Icon vector="Ionicons" name="document-text-outline" size={20} color={theme.color.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default EventDetail;

