import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { theme } from "@/utils/designSystem";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, View } from "react-native-ui-lib";

const ProviderEventDetail = () => {
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
          style={{ width: "100%", height: moderateScale(240) }}
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
        {/* Main compact card */}
        <View
          marginT-16
          style={{
            backgroundColor: "#1E1E1E",
            borderRadius: moderateScale(16),
            padding: moderateScale(16),
          }}
        >
          <Text bold large24 style={{ color: "#fff" }}>
            Sunset Soundscapes: An Evening of Eclectic Music and City Lights
          </Text>

          <View row marginT-14>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Date
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }}>
                February 14, 2024
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Time
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }}>
                5:00 PM - 10:00 PM
              </Text>
            </View>
          </View>

          <View row marginT-10>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Type
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }}>
                Staffing
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Venue
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }}>
                4 Members
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View marginT-22>
          <Text bold large20 style={{ color: "#fff" }}>
            Job Description
          </Text>
          <Text marginT-10 small regular style={{ color: "#818898", lineHeight: moderateScale(20) }}>
            Join us for a magical night at Sunset Soundscapes: An Evening of Eclectic Music and City Lights,
            where the heart of Chicago comes alive with the sounds of diverse musical talents.
          </Text>

          <View marginT-16>
            {["Leaks under kitchen and bathroom sinks", "Leaks under kitchen and bathroom sinks"].map((t, idx) => (
              <View key={idx} row centerV marginT-10>
                <Icon vector="Ionicons" name="checkmark-circle" size={16} color={theme.color.primary} />
                <Text small regular style={{ color: "#fff", marginLeft: 8 }}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Location + map */}
        <View marginT-18>
          <Text bold large20 style={{ color: "#fff" }}>
            Location
          </Text>
          <View row centerV marginT-12>
            <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
            <Text semibold small style={{ color: "#fff", marginLeft: 8 }}>
              Millennium Park, Chicago, IL
            </Text>
          </View>

          <View
            marginT-12
            style={{
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2400&auto=format&fit=crop" }}
              style={{ width: "100%", height: moderateScale(140) }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Bottom action */}
        <View marginT-26 marginB-10>
          <CustomButton
            label="Check-In"
            onPress={() => {}}
            backgroundColor={theme.color.primary}
            style={{ width: "100%" }}
          />
          <Text marginT-10 small regular style={{ color: "#F14336", textAlign: "center" }}>
            Please check-in once you arrive at the job site.
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default ProviderEventDetail;
