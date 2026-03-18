import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { Calendar } from "react-native-calendars";
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

function formatLongDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const Explore = () => {
  const today = new Date();
  const initialSelected = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const [selected, setSelected] = React.useState(initialSelected);

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
      {/* Header */}
      <View row centerV>
        <BackButton style={{ marginBottom: 0, width: moderateScale(44), height: moderateScale(44) }} />
        <View flex center>
          <Text semibold regularSize style={{ color: "#fff" }}>
            Search Events
          </Text>
        </View>
        <View width={moderateScale(44)} />
      </View>

      {/* Calendar */}
      <View marginT-24>
        <View row spread centerV marginB-12>
          <Text bold large20 style={{ color: "#fff" }}>
            Calender
          </Text>
        <TouchableOpacity row centerV onPress={() => {}}>
            <Text semibold small style={{ color: theme.color.primary }}>
              {new Date(`${selected}T00:00:00`).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Icon
              vector="Ionicons"
              name="chevron-down"
              size={18}
              color={theme.color.primary}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>

        <Calendar
          current={selected}
          onDayPress={(day) => setSelected(day.dateString)}
          enableSwipeMonths
          hideExtraDays
          markedDates={{
            [selected]: {
              selected: true,
              selectedColor: theme.color.primary,
              selectedTextColor: "#fff",
            },
          }}
          theme={{
            backgroundColor: "#000",
            calendarBackground: "#000",
            monthTextColor: "#fff",
            dayTextColor: "#fff",
            textDisabledColor: "#3A3A3A",
            textSectionTitleColor: "#818898",
            selectedDayBackgroundColor: theme.color.primary,
            selectedDayTextColor: "#fff",
            todayTextColor: theme.color.primary,
            arrowColor: theme.color.primary,
            textDayFontWeight: "500",
            textMonthFontWeight: "700",
          }}
          style={{
            borderRadius: moderateScale(16),
          }}
        />
      </View>

      {/* Selected Date */}
      <Text marginT-28 bold large24 style={{ color: "#fff" }}>
        {formatLongDate(selected)}
      </Text>

      {/* Event Cards (same as Home) */}
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
                <Text
                  small
                  regular
                  style={{ color: "#818898", marginLeft: 6 }}
                >
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

export default Explore;

