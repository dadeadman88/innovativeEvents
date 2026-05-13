import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { RootState } from "@/redux/store";
import { CONTRACTOR_PROFILE_AVATAR_URL } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { ScrollView } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";

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

function formatMonthYear(date: Date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatWeekdayShort(date: Date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

const AVAILABLE_BASE: Omit<JobEvent, "start" | "end">[] = [
    {
        id: "a1",
        title: "Brand Activation: Street Team Launch",
        location: "Downtown, Chicago, IL",
        status: "Open",
        statusColor: "#109CD9",
    },
    {
        id: "a2",
        title: "Festival Booth Support",
        location: "Grant Park, Chicago, IL",
        status: "Urgent",
        statusColor: "#F59E0B",
    },
    {
        id: "a3",
        title: "Product Sampling: Grocery Campaign",
        location: "Wicker Park, Chicago, IL",
        status: "Open",
        statusColor: "#109CD9",
    },
];

const ACTIVE_BASE: Omit<JobEvent, "start" | "end">[] = [
    {
        id: "x1",
        title: "Conference Registration Desk",
        location: "McCormick Place, Chicago, IL",
        status: "In progress",
        statusColor: "#8B7FC7",
    },
    {
        id: "x2",
        title: "VIP Check-in & Guest Support",
        location: "Navy Pier, Chicago, IL",
        status: "Assigned",
        statusColor: "#22C55E",
    },
];

function getJobsForDate(tab: "available" | "active", _isoDate: string): JobEvent[] {
    const times: Array<Pick<JobEvent, "start" | "end">> =
        tab === "available"
            ? [
                  { start: "07:30", end: "09:00" },
                  { start: "10:00", end: "12:00" },
                  { start: "13:00", end: "15:00" },
              ]
            : [
                  { start: "09:00", end: "11:00" },
                  { start: "12:30", end: "14:30" },
              ];

    const base = tab === "available" ? AVAILABLE_BASE : ACTIVE_BASE;
    return base.map((evt, idx) => ({
        ...evt,
        start: times[idx % times.length].start,
        end: times[idx % times.length].end,
    }));
}

const Home = () => {
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

    const jobsForSelected = React.useMemo(() => {
        const items = getJobsForDate(activeTab, selectedDate);
        return [...items].sort((a, b) => minutesFromHHmm(a.start) - minutesFromHHmm(b.start));
    }, [activeTab, selectedDate]);

    const HOUR_START = 7;
    const HOUR_END = 15;
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
                    onPress={() => setActiveTab("active")}
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: moderateScale(40) }}
                >
                    <View row>
                        {/* Time Column */}
                        <View style={{ width: moderateScale(56) }}>
                            {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
                                const hour = HOUR_START + i;
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
                            {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
                                const hour = HOUR_START + i;
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

                            <View style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}>
                                {jobsForSelected.map((evt) => {
                                    const startMin = minutesFromHHmm(evt.start);
                                    const endMin = minutesFromHHmm(evt.end);
                                    const baseMin = HOUR_START * 60;
                                    const top = ((startMin - baseMin) / 60) * HOUR_HEIGHT;
                                    const height = Math.max(
                                        moderateScale(44),
                                        ((endMin - startMin) / 60) * HOUR_HEIGHT
                                    );

                                    return (
                                        <TouchableOpacity
                                            key={evt.id}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/(main)/(provider)/providerEventDetail",
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
            </View>
        </Container>
    );
};

export default Home;
