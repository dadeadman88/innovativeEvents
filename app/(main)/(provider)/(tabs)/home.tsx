import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem, EventActions } from "@/redux/actions/EventActions";
import { AppDispatch, RootState } from "@/redux/store";
import { CONTRACTOR_PROFILE_AVATAR_URL } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

type JobEvent = {
    id: string;
    title: string;
    location: string;
    status: string;
    statusColor: string;
    start: string; // HH:mm
    end: string; // HH:mm
};

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

function minutesFromHHmm(hhmm: string) {
    const [h, m] = hhmm.split(":").map((x) => Number(x));
    return h * 60 + m;
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

function statusColorForEvent(status: string): string {
    if (status === "Completed") return "#22C55E";
    if (status === "Waiting") return "#109CD9";
    return "#8B7FC7";
}

function mapApiEventToJob(evt: CustomerEventListItem): JobEvent {
    return {
        id: evt.id,
        title: evt.title,
        location: evt.address,
        status: evt.status,
        statusColor: statusColorForEvent(evt.status),
        start: hhMmFromApi(evt.startTime),
        end: hhMmFromApi(evt.endTime),
    };
}

function formatMonthYear(date: Date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatWeekdayShort(date: Date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const greetingName =
        user?.firstName?.trim() ||
        user?.fullName?.trim()?.split(/\s+/)?.[0] ||
        "there";
    const avatarUri = user?.avatarUrl?.trim() || CONTRACTOR_PROFILE_AVATAR_URL;

    const [activeTab, setActiveTab] = React.useState<"available" | "active">("available");

    const initialSelected = React.useMemo(() => toISODate(new Date()), []);
    const [selectedDate, setSelectedDate] = React.useState(initialSelected);
    const selectedDateObj = React.useMemo(() => parseISODate(selectedDate), [selectedDate]);
    const monthLabel = React.useMemo(() => formatMonthYear(selectedDateObj), [selectedDateObj]);

    const dayStrip = React.useMemo(() => {
        const center = parseISODate(selectedDate);
        return Array.from({ length: 7 }, (_, i) => addDays(center, i - 3));
    }, [selectedDate]);

    const [availableEvents, setAvailableEvents] = React.useState<CustomerEventListItem[]>([]);
    const [loadingAvailable, setLoadingAvailable] = React.useState(true);
    const [activeEvents, setActiveEvents] = React.useState<CustomerEventListItem[]>([]);
    const [loadingActive, setLoadingActive] = React.useState(false);

    /**
     * Bumped every time this tab screen regains focus (e.g. after returning
     * from the event detail screen). The two fetch effects below include this
     * value in their dependency arrays so they re-run and pull fresh data,
     * which lets newly claimed jobs move between the Available / Active tabs
     * the next time the user opens an event.
     */
    const [refreshKey, setRefreshKey] = React.useState(0);
    useFocusEffect(
        React.useCallback(() => {
            setRefreshKey((k) => k + 1);
        }, [])
    );

    React.useEffect(() => {
        if (activeTab !== "available") return;

        let cancelled = false;
        (async () => {
            setLoadingAvailable(true);
            try {
                const list = await dispatch(
                    EventActions.FetchEventsByDate({ date: selectedDate })
                ).unwrap();
                if (!cancelled) {
                    const sorted = [...list].sort(
                        (a, b) => minutesFromHhMmSs(a.startTime) - minutesFromHhMmSs(b.startTime)
                    );
                    setAvailableEvents(sorted);
                }
            } catch {
                if (!cancelled) setAvailableEvents([]);
            } finally {
                if (!cancelled) setLoadingAvailable(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [dispatch, selectedDate, activeTab, refreshKey]);

    React.useEffect(() => {
        if (activeTab !== "active") return;

        let cancelled = false;
        (async () => {
            setLoadingActive(true);
            console.log("[Active Jobs] fetching", { date: selectedDate });
            try {
                const list = await dispatch(
                    EventActions.FetchContractorEventsByDate({ date: selectedDate })
                ).unwrap();
                console.log("[Active Jobs] response", list);
                if (!cancelled) {
                    const sorted = [...list].sort(
                        (a, b) => minutesFromHhMmSs(a.startTime) - minutesFromHhMmSs(b.startTime)
                    );
                    setActiveEvents(sorted);
                }
            } catch (error) {
                console.log("[Active Jobs] error", error);
                if (!cancelled) setActiveEvents([]);
            } finally {
                if (!cancelled) setLoadingActive(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [dispatch, selectedDate, activeTab, refreshKey]);

    const timelineEvents = activeTab === "available" ? availableEvents : activeEvents;

    const jobsForSelected = React.useMemo(
        () => timelineEvents.map(mapApiEventToJob),
        [timelineEvents]
    );

    const isLoading = activeTab === "available" ? loadingAvailable : loadingActive;

    const { hourStart, hourEnd } = React.useMemo(() => {
        const defaultStart = 7;
        const defaultEnd = 15;
        if (timelineEvents.length === 0) {
            return { hourStart: defaultStart, hourEnd: defaultEnd };
        }
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
                        source={{ uri: avatarUri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>

            {/* Main Heading */}
            <Text bold large32 marginT-20 style={{ color: "#fff", lineHeight: moderateScale(40) }}>
                Hi {greetingName} 👋
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
                    onPress={() => {
                        console.log("[Active Jobs] tab tapped", { date: selectedDate });
                        setActiveTab("active");
                    }}
                >
                    <Text semibold small style={{ color: "#fff" }}>
                        Active Jobs
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Calendar (Month Header + Day Strip) */}
            <View marginT-20>
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
                                <Text bold medium style={{ color: "#fff" }}>
                                    {d.getDate()}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Timeline (Jobs) */}
            <View
                marginT-18
                style={{
                    borderTopWidth: 1,
                    borderColor: "#1E1E1E",
                    paddingTop: moderateScale(14),
                }}
            >
                {isLoading ? (
                    <View center paddingV-40>
                        <ActivityIndicator color={theme.color.primary} />
                    </View>
                ) : jobsForSelected.length === 0 ? (
                    <View center paddingV-32>
                        <Text regular small style={{ color: "#818898", textAlign: "center" }}>
                            {activeTab === "available"
                                ? "No available jobs for this day."
                                : "No active jobs for this day."}
                        </Text>
                    </View>
                ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: moderateScale(40) }}
                >
                    <View row>
                        {/* Time Column */}
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

                        {/* Grid + Events */}
                        <View style={{ flex: 1, position: "relative", paddingLeft: moderateScale(10) }}>
                            {/* Grid lines */}
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
                                {jobsForSelected.map((evt, idx) => {
                                    const startMin = minutesFromHHmm(evt.start);
                                    const endMin = minutesFromHHmm(evt.end);
                                    const baseMin = hourStart * 60;
                                    const top = ((startMin - baseMin) / 60) * HOUR_HEIGHT;
                                    const height = Math.max(
                                        moderateScale(44),
                                        ((endMin - startMin) / 60) * HOUR_HEIGHT
                                    );

                                    const apiEvent = timelineEvents[idx];

                                    return (
                                        <TouchableOpacity
                                            key={`${evt.id}-${idx}`}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/(main)/(provider)/providerEventDetail",
                                                    params: {
                                                        eventId: apiEvent?.id ?? evt.id,
                                                    },
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
                                            {/* Accent bar */}
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
                                                        <Icon
                                                            vector="Ionicons"
                                                            name="location"
                                                            size={14}
                                                            color={theme.color.primary}
                                                        />
                                                        <Text
                                                            small
                                                            regular
                                                            numberOfLines={1}
                                                            style={{ color: "#818898", marginLeft: 6, flex: 1 }}
                                                        >
                                                            {evt.location}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={{ alignItems: "flex-end" }}>
                                                    <Text semibold extraSmall style={{ color: "#818898" }}>
                                                        {evt.start} – {evt.end}
                                                    </Text>
                                                    <View
                                                        style={{
                                                            marginTop: moderateScale(8),
                                                            paddingHorizontal: moderateScale(10),
                                                            paddingVertical: moderateScale(4),
                                                            borderRadius: moderateScale(20),
                                                            backgroundColor: evt.statusColor,
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
