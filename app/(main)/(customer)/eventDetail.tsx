import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem } from "@/redux/actions/EventActions";
import { theme } from "@/utils/designSystem";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

function parseEventParam(raw: string | string[] | undefined): CustomerEventListItem | null {
  if (raw == null) return null;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s) return null;
  try {
    return JSON.parse(decodeURIComponent(s)) as CustomerEventListItem;
  } catch {
    try {
      return JSON.parse(s) as CustomerEventListItem;
    } catch {
      return null;
    }
  }
}

function formatScheduleLine(event: CustomerEventListItem): string {
  const { eventDate, startTime, endTime } = event;
  if (!eventDate && !startTime && !endTime) return "—";
  let datePart = "";
  if (eventDate) {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(eventDate.trim());
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const d = Number(m[3]);
      const dt = new Date(y, mo - 1, d);
      if (!Number.isNaN(dt.getTime())) {
        datePart = dt.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    }
    if (!datePart) datePart = eventDate;
  }
  const timeParts = [startTime, endTime].filter(Boolean);
  const timePart = timeParts.length ? timeParts.join(" – ") : "";
  if (datePart && timePart) return `${datePart} · ${timePart}`;
  return datePart || timePart || "—";
}

const EventDetail = () => {
  const { event: eventParam } = useLocalSearchParams<{ event?: string }>();
  const event = React.useMemo(() => parseEventParam(eventParam), [eventParam]);

  const title = event?.title ?? "Event";
  const scheduleLine = event ? formatScheduleLine(event) : "—";
  const about =
    event?.description?.trim() ||
    "No description has been provided for this event.";
  const address = event?.address?.trim() || "—";
  const locationTitle = address.includes(",") ? address.split(",")[0].trim() : address;
  const locationSubtitle = address.includes(",")
    ? address
        .slice(address.indexOf(",") + 1)
        .trim()
    : "";

  const organizerTitle =
    event?.organizerName?.trim() || event?.service?.trim() || "—";
  const organizerMeta = [event?.contactEmail, event?.contactPhone].filter(Boolean).join(" · ") || "—";

  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      containerProps={{ style: { paddingHorizontal: 0, paddingBottom: "4%" } }}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      <View
        row
        centerV
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: "6%",
          alignItems: "center",
        }}
      >
        <BackButton style={{ marginBottom: 0 }} />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text semibold regularSize style={{ color: "#fff" }}>
            Event Details
          </Text>
        </View>
        <View style={{ width: moderateScale(50) }} />
      </View>

      <View style={{ paddingHorizontal: "6%" }}>
        <View marginT-20>
          <Text bold large24 style={{ color: "#fff" }}>
            {title}
          </Text>

          <View row centerV marginT-10>
            <Icon vector="Ionicons" name="calendar-outline" size={18} color={theme.color.primary} />
            <Text small regular style={{ color: "#818898", marginLeft: 8, flex: 1 }} numberOfLines={3}>
              {scheduleLine}
            </Text>
          </View>
        </View>

        <View marginT-24>
          <Text bold large20 style={{ color: "#fff" }}>
            About this event
          </Text>
          <Text marginT-10 small regular style={{ color: "#818898", lineHeight: moderateScale(20) }}>
            {about}
          </Text>
        </View>

        <View marginT-24>
          <Text bold large20 style={{ color: "#fff" }}>
            Location
          </Text>
          <View row centerV marginT-10>
            <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
            <View marginL-8 flex>
              <Text semibold small style={{ color: "#fff" }} numberOfLines={2}>
                {locationTitle}
              </Text>
              {!!locationSubtitle && (
                <Text extraSmall regular style={{ color: "#818898", marginTop: 2 }} numberOfLines={4}>
                  {locationSubtitle}
                </Text>
              )}
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
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2400&auto=format&fit=crop" }}
              style={{ width: "100%", height: moderateScale(120) }}
              resizeMode="cover"
            />
          </View>
        </View>

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
            <Text semibold small style={{ color: "#fff" }} numberOfLines={2}>
              {organizerTitle}
            </Text>
            <Text marginT-6 extraSmall regular style={{ color: "#818898" }} numberOfLines={3}>
              {organizerMeta}
            </Text>
          </View>
        </View>

        <View marginT-24 marginB-30>
          <Text bold large20 style={{ color: "#fff" }}>
            Documents
          </Text>
          <TouchableOpacity
            disabled
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
              No document
            </Text>
            <Icon vector="Ionicons" name="document-text-outline" size={20} color={theme.color.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default EventDetail;
