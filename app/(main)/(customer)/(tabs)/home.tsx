import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem, EventActions } from "@/redux/actions/EventActions";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function parseISODate(iso: string) {
  const [yy, mm, dd] = iso.split("-");
  const y = Number(yy);
  const m = Number(mm);
  const d = Number(dd);
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
}

function toISODate(d: Date) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonthsKeepingDay(date: Date, deltaMonths: number) {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + deltaMonths);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, lastDay));
  return d;
}

/** Minutes from midnight; supports HH:mm or HH:mm:ss */
function minutesFromHhMmSs(t?: string): number {
  if (!t?.trim()) return 9 * 60;
  const p = t
    .trim()
    .split(":")
    .map((x) => Number(x));
  const h = Math.min(23, Math.max(0, p[0] || 0));
  const m = Math.min(59, Math.max(0, p[1] || 0));
  return h * 60 + m;
}

function hhMmFromApi(t?: string): string {
  if (!t?.trim()) return "09:00";
  const p = t.trim().split(":");
  if (p.length >= 2) {
    const h = pad2(Math.min(23, Math.max(0, Number(p[0]) || 0)));
    const m = pad2(Math.min(59, Math.max(0, Number(p[1]) || 0)));
    return `${h}:${m}`;
  }
  return "09:00";
}

function getStartEndMinutes(item: CustomerEventListItem): { startMin: number; endMin: number } {
  let startMin = minutesFromHhMmSs(item.startTime);
  let endMin = minutesFromHhMmSs(item.endTime);
  if (!item.startTime?.trim() && !item.endTime?.trim()) {
    startMin = 9 * 60;
    endMin = 10 * 60;
  } else if (!item.endTime?.trim()) {
    endMin = startMin + 60;
  } else if (endMin <= startMin) {
    endMin = startMin + 30;
  }
  return { startMin, endMin };
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatWeekdayShort(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fullName = useSelector((state: RootState) => state.auth.user?.fullName);

  const initialSelected = React.useMemo(() => toISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = React.useState(initialSelected);
  const [timelineEvents, setTimelineEvents] = React.useState<CustomerEventListItem[]>([]);
  const [loadingTimeline, setLoadingTimeline] = React.useState(true);

  const selectedDateObj = React.useMemo(() => parseISODate(selectedDate), [selectedDate]);
  const monthLabel = React.useMemo(() => formatMonthYear(selectedDateObj), [selectedDateObj]);

  const dayStrip = React.useMemo(() => {
    const center = parseISODate(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(center, i - 3));
  }, [selectedDate]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTimeline(true);
      try {
        const list = await dispatch(
          EventActions.FetchEventsByDate({ date: selectedDate })
        ).unwrap();
        if (!cancelled) {
          const sorted = [...list].sort(
            (a, b) => minutesFromHhMmSs(a.startTime) - minutesFromHhMmSs(b.startTime)
          );
          setTimelineEvents(sorted);
        }
      } catch {
        if (!cancelled) setTimelineEvents([]);
      } finally {
        if (!cancelled) setLoadingTimeline(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, selectedDate]);

  const { hourStart, hourEnd } = React.useMemo(() => {
    const defaultStart = 7;
    const defaultEnd = 15;
    if (timelineEvents.length === 0) return { hourStart: defaultStart, hourEnd: defaultEnd };
    let minM = 24 * 60;
    let maxM = 0;
    for (const e of timelineEvents) {
      const { startMin, endMin } = getStartEndMinutes(e);
      if (startMin < minM) minM = startMin;
      if (endMin > maxM) maxM = endMin;
    }
    const startH = Math.max(0, Math.floor(minM / 60) - 1);
    const endH = Math.min(23, Math.max(Math.ceil(maxM / 60) + 1, startH + 1));
    return { hourStart: startH, hourEnd: endH };
  }, [timelineEvents]);

  const HOUR_HEIGHT = moderateScale(62);

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
          onPress={() => router.push("/profile")}
        >
          <Image
            source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxoVYK9gVqDWkfv3blKuxWEO0t9JrH6XSjxg&s" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <Text marginT-20 small regular style={{ color: "#818898" }}>
        Hello, {fullName || "there"} 👋
      </Text>

      <Text bold large32 marginT-8 style={{ color: "#fff", lineHeight: moderateScale(40) }}>
        Let's find various events around you!
      </Text>

      <View marginT-24>
        <View row centerV spread>
          <TouchableOpacity
            onPress={() => setSelectedDate(toISODate(addMonthsKeepingDay(selectedDateObj, -1)))}
            style={{ width: moderateScale(44), height: moderateScale(44) }}
            center
          >
            <Icon vector="Ionicons" name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text semibold regularSize style={{ color: "#fff" }}>
            {monthLabel}
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedDate(toISODate(addMonthsKeepingDay(selectedDateObj, 1)))}
            style={{ width: moderateScale(44), height: moderateScale(44) }}
            center
          >
            <Icon vector="Ionicons" name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: moderateScale(14) }}
          contentContainerStyle={{ paddingVertical: moderateScale(4) }}
        >
          {dayStrip.map((d, idx) => {
            const iso = toISODate(d);
            const isSelected = iso === selectedDate;
            const isToday = iso === toISODate(new Date());

            return (
              <TouchableOpacity
                key={`${iso}-${idx}`}
                onPress={() => setSelectedDate(iso)}
                style={{
                  width: moderateScale(54),
                  marginRight: moderateScale(10),
                  paddingVertical: moderateScale(10),
                  borderRadius: moderateScale(14),
                  backgroundColor: isSelected ? theme.color.primary : "#121212",
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: "#2A2A2A",
                }}
                center
              >
                <Text
                  semibold
                  extraSmall
                  style={{
                    color: isSelected ? "#fff" : "#818898",
                    marginBottom: moderateScale(6),
                  }}
                >
                  {isToday ? "Today" : formatWeekdayShort(d)}
                </Text>
                <Text bold medium style={{ color: isSelected ? "#fff" : "#fff" }}>
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View marginT-18 style={{ borderTopWidth: 1, borderColor: "#1E1E1E", paddingTop: moderateScale(14) }}>
        {loadingTimeline ? (
          <View center paddingV-40>
            <ActivityIndicator color={theme.color.primary} />
          </View>
        ) : timelineEvents.length === 0 ? (
          <View center paddingV-32>
            <Text regular small style={{ color: "#818898", textAlign: "center" }}>
              No events for this day.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: moderateScale(40),
            }}
          >
            <View row>
              <View style={{ width: moderateScale(56) }}>
                {Array.from({ length: hourEnd - hourStart + 1 }, (_, i) => {
                  const hour = hourStart + i;
                  return (
                    <View key={hour} style={{ height: HOUR_HEIGHT }}>
                      <Text semibold extraSmall style={{ color: "#818898" }}>
                        {pad2(hour)}:00
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={{ flex: 1, position: "relative", paddingLeft: moderateScale(10) }}>
                {Array.from({ length: hourEnd - hourStart + 1 }, (_, i) => {
                  const hour = hourStart + i;
                  return (
                    <View
                      key={`line-${hour}`}
                      style={{
                        position: "absolute",
                        top: i * HOUR_HEIGHT + moderateScale(10),
                        left: 0,
                        right: 0,
                        height: 1,
                        backgroundColor: "#1E1E1E",
                      }}
                    />
                  );
                })}

                <View style={{ height: (hourEnd - hourStart + 1) * HOUR_HEIGHT }}>
                  {timelineEvents.map((evt, idx) => {
                    const { startMin, endMin } = getStartEndMinutes(evt);
                    const baseMin = hourStart * 60;
                    const top = ((startMin - baseMin) / 60) * HOUR_HEIGHT;
                    const height = Math.max(
                      moderateScale(44),
                      ((endMin - startMin) / 60) * HOUR_HEIGHT
                    );
                    const statusColor = evt.status === "Completed" ? "#22C55E" : "#8B7FC7";
                    const t0 = hhMmFromApi(evt.startTime);
                    const t1 = hhMmFromApi(evt.endTime);

                    return (
                      <TouchableOpacity
                        key={`${evt.id}-${idx}`}
                        onPress={() =>
                          router.push({
                            pathname: "/eventDetail",
                            params: { event: encodeURIComponent(JSON.stringify(evt)) },
                          })
                        }
                        style={{
                          position: "absolute",
                          top,
                          left: 0,
                          right: 0,
                          height,
                          backgroundColor: "#1E1E1E",
                          borderRadius: moderateScale(14),
                          paddingHorizontal: moderateScale(14),
                          paddingVertical: moderateScale(12),
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: moderateScale(4),
                            backgroundColor: theme.color.primary,
                          }}
                        />

                        <View row spread>
                          <View style={{ flex: 1, paddingRight: moderateScale(10) }}>
                            <Text bold medium numberOfLines={1} style={{ color: "#fff" }}>
                              {evt.title}
                            </Text>
                            <View row centerV marginT-4>
                              <Icon vector="Ionicons" name="location" size={14} color={theme.color.primary} />
                              <Text
                                small
                                regular
                                numberOfLines={1}
                                style={{ color: "#818898", marginLeft: 6, flex: 1 }}
                              >
                                {evt.address}
                              </Text>
                            </View>
                          </View>

                          <View style={{ alignItems: "flex-end" }}>
                            <Text semibold extraSmall style={{ color: "#818898" }}>
                              {t0} – {t1}
                            </Text>
                            <View
                              style={{
                                marginTop: moderateScale(8),
                                paddingHorizontal: moderateScale(10),
                                paddingVertical: moderateScale(4),
                                borderRadius: moderateScale(20),
                                backgroundColor: statusColor,
                              }}
                            >
                              <Text semibold extraSmall style={{ color: "#fff" }}>
                                {evt.status}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Container>
  );
};

export default Home;
