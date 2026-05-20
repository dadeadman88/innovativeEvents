import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem, EventActions } from "@/redux/actions/EventActions";
import { AppDispatch } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";

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

function hhMmFromApi(t?: string): string {
    if (!t?.trim()) return "";
    const p = t.trim().split(":");
    if (p.length >= 2) {
        const h = pad2(Math.min(23, Math.max(0, Number(p[0]) || 0)));
        const m = pad2(Math.min(59, Math.max(0, Number(p[1]) || 0)));
        return `${h}:${m}`;
    }
    return "";
}

function minutesFromHhMmSs(t?: string): number {
    if (!t?.trim()) return 0;
    const p = t
        .trim()
        .split(":")
        .map((x) => Number(x));
    const h = Math.min(23, Math.max(0, p[0] || 0));
    const m = Math.min(59, Math.max(0, p[1] || 0));
    return h * 60 + m;
}

function formatEventDateRange(evt: CustomerEventListItem): string {
    const parts: string[] = [];
    const iso = evt.eventDate?.slice(0, 10);

    if (iso) {
        const today = toISODate(new Date());
        const tomorrow = toISODate(addDays(new Date(), 1));
        if (iso === today) parts.push("Today");
        else if (iso === tomorrow) parts.push("Tomorrow");
        else {
            parts.push(
                parseISODate(iso).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
            );
        }
    }

    const start = hhMmFromApi(evt.startTime);
    const end = hhMmFromApi(evt.endTime);
    if (start && end) {
        const startMin = minutesFromHhMmSs(evt.startTime);
        const endMin = minutesFromHhMmSs(evt.endTime);
        const hrs = Math.max(1, Math.round((endMin - startMin) / 60));
        if (endMin > startMin) {
            parts.push(`${hrs} hr${hrs !== 1 ? "s" : ""}`);
        } else {
            parts.push(`${start} – ${end}`);
        }
    } else if (start) {
        parts.push(start);
    }

    return parts.length ? parts.join(": ") : "—";
}

function statusColorForEvent(status: string): string {
    const s = status.toLowerCase();
    if (status === "Completed" || /\b(staffed|assigned)\b/.test(s)) return "#22C55E";
    if (status === "Waiting" || /\b(open|active|progress)\b/.test(s)) return "#109CD9";
    return "#8B7FC7";
}

const ProviderEvents = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [events, setEvents] = React.useState<CustomerEventListItem[]>([]);
    const [loadingList, setLoadingList] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);

    const loadEvents = React.useCallback(
        async (options?: { refresh?: boolean }) => {
            const isRefresh = options?.refresh;
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoadingList(true);
            }
            try {
                const list = await dispatch(EventActions.FetchContractorEvents()).unwrap();
                setEvents(list);
            } catch {
                setEvents([]);
            } finally {
                setLoadingList(false);
                setRefreshing(false);
            }
        },
        [dispatch]
    );

    // Refresh the list every time this tab gains focus (initial mount, tab
    // switches back, returning from the event detail screen). Mirrors the
    // home screen's behavior so newly claimed/applied jobs show up here
    // without needing a manual pull-to-refresh.
    useFocusEffect(
        React.useCallback(() => {
            loadEvents();
        }, [loadEvents])
    );

    const onRefresh = React.useCallback(() => {
        loadEvents({ refresh: true });
    }, [loadEvents]);

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollProps={{ showsVerticalScrollIndicator: false }}
            refreshing={refreshing}
            onRefresh={onRefresh}
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
                {loadingList ? (
                    <View center paddingV-40>
                        <ActivityIndicator color={theme.color.primary} />
                    </View>
                ) : events.length === 0 ? (
                    <View center paddingV-32>
                        <Text regular small style={{ color: "#818898", textAlign: "center" }}>
                            No events yet.
                        </Text>
                    </View>
                ) : (
                    events.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            marginB-16
                            style={{
                                backgroundColor: "#1E1E1E",
                                borderRadius: moderateScale(18),
                                overflow: "hidden",
                            }}
                            onPress={() =>
                                router.push({
                                    pathname: "/(main)/(provider)/providerEventDetail",
                                    params: { eventId: event.id },
                                })
                            }
                        >
                            <View padding-16>
                                <View row spread>
                                    <Text
                                        bold
                                        medium
                                        numberOfLines={2}
                                        style={{ color: "#fff", flex: 1, paddingRight: moderateScale(10) }}
                                    >
                                        {event.title}
                                    </Text>
                                    <View
                                        style={{
                                            paddingHorizontal: moderateScale(10),
                                            paddingVertical: moderateScale(4),
                                            borderRadius: moderateScale(20),
                                            backgroundColor: statusColorForEvent(event.status),
                                            alignSelf: "flex-start",
                                        }}
                                    >
                                        <Text semibold extraSmall style={{ color: "#fff" }}>
                                            {event.status}
                                        </Text>
                                    </View>
                                </View>

                                <View row centerV marginT-8>
                                    <Icon
                                        vector="Ionicons"
                                        name="location"
                                        size={16}
                                        color={theme.color.primary}
                                    />
                                    <Text small regular style={{ color: "#818898", marginLeft: 6 }}>
                                        {event.address}
                                    </Text>
                                </View>

                                <View row centerV marginT-10>
                                    <Icon
                                        vector="Ionicons"
                                        name="time-outline"
                                        size={16}
                                        color={theme.color.primary}
                                    />
                                    <Text small regular style={{ color: "#818898", marginLeft: 6 }}>
                                        {formatEventDateRange(event)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </Container>
    );
};

export default ProviderEvents;
