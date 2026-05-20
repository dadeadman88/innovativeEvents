import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { CustomerEventListItem, EventActions } from "@/redux/actions/EventActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Image, Text, ToastPresets, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

/**
 * Reads the requested event id from route params. Accepts either the new
 * `eventId` param (preferred) or the legacy `event` URL-encoded JSON param
 * (kept so any in-flight navigations from before the refactor still resolve).
 */
function getRequestedEventId(params: {
  eventId?: string | string[];
  event?: string | string[];
}): string | null {
  const raw = params.eventId;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s && s.trim()) return s.trim();
  const legacy = params.event;
  const ls = Array.isArray(legacy) ? legacy[0] : legacy;
  if (!ls) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(ls)) as CustomerEventListItem;
    return parsed?.id ?? null;
  } catch {
    try {
      const parsed = JSON.parse(ls) as CustomerEventListItem;
      return parsed?.id ?? null;
    } catch {
      return null;
    }
  }
}

/** Format a "YYYY-MM-DD" date as "February 14, 2024". Falls back to the raw input. */
function formatLongDate(iso?: string): string {
  if (!iso?.trim()) return "—";
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(iso.trim());
  if (!m) return iso.trim();
  const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(dt.getTime())) return iso.trim();
  return dt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert "HH:mm" or "HH:mm:ss" to a 12-hour label like "5:00 PM". */
function formatTime12hr(t?: string): string {
  if (!t?.trim()) return "";
  const parts = t.trim().split(":");
  if (parts.length < 2) return "";
  const h24 = Math.min(23, Math.max(0, Number(parts[0]) || 0));
  const m = Math.min(59, Math.max(0, Number(parts[1]) || 0));
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = m < 10 ? `0${m}` : `${m}`;
  return `${h12}:${mm} ${period}`;
}

function formatTimeRange(start?: string, end?: string): string {
  const s = formatTime12hr(start);
  const e = formatTime12hr(end);
  if (s && e) return `${s} - ${e}`;
  return s || e || "—";
}

type ActionKind = "claim" | "applied" | "rejected" | "checkin" | "completed" | "none";

const ProviderEventDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  const params = useLocalSearchParams<{ eventId?: string; event?: string }>();
  const requestedId = React.useMemo(() => getRequestedEventId(params), [params]);
  // Always read the event from the redux store so we get the latest
  // `assigned_list` (refreshed whenever the home tab refetches) rather than
  // a snapshot serialized into the URL at navigation time.
  const event = useSelector((s: RootState) =>
    requestedId ? s.events.byId[requestedId] ?? null : null
  );
  const userId = useSelector((s: RootState) => s.auth.user?.id);
  const [claiming, setClaiming] = React.useState(false);
  const [claimed, setClaimed] = React.useState(false);

  const handleClaimShift = React.useCallback(async () => {
    if (!event?.id || claiming) return;
    setClaiming(true);
    try {
      await dispatch(EventActions.ContractorRespondEvent({ id: event.id })).unwrap();
      setClaimed(true);
      Toaster({
        visible: true,
        message: "You have successfully applied for the job.",
        preset: ToastPresets.SUCCESS,
      });
      if (router.canGoBack()) router.back();
    } catch {
      // The axios interceptor already surfaces a failure toast for server errors.
    } finally {
      setClaiming(false);
    }
  }, [dispatch, event?.id, claiming, Toaster]);

  /**
   * Find the current user's row inside the event's `assigned_list` and decide
   * which action button to render:
   *   - "assigned"  → "Claim this shift" + availability helper text
   *   - "applied"   → disabled "Applied" + already-applied helper text
   *   - "rejected"  → disabled "Rejected" + rejected helper text
   *   - "accepted"  → "Check-In" + existing helper text
   *   - "completed" → disabled "Job Completed" (no helper text)
   *
   * Defaults to "Claim this shift" when no matching entry is found — this
   * covers `assigned_list: []` (no one has applied/been assigned yet) and the
   * case where the current contractor simply isn't in the list, since both
   * mean the shift is still claimable.
   */
  const myAssignment = React.useMemo(() => {
    const list = event?.assignedList;
    if (!list?.length || !userId) return null;
    const uid = String(userId).trim();
    return (
      list.find((entry) => entry.contractorId && entry.contractorId.trim() === uid) ?? null
    );
  }, [event?.assignedList, userId]);

  const actionKind: ActionKind = React.useMemo(() => {
    // No `assigned_list` entry for this user (including the case where the
    // list is empty) → the shift is still claimable.
    if (!myAssignment) return "claim";
    // Compare case-insensitively against whatever casing the backend used in
    // the raw `status` string on this entry of `assigned_list`.
    switch (myAssignment.status.trim().toLowerCase()) {
      case "assigned":
        return "claim";
      case "applied":
        return "applied";
      case "rejected":
        return "rejected";
      case "accepted":
        return "checkin";
      case "completed":
        return "completed";
      default:
        return "claim";
    }
  }, [myAssignment]);

  const title = event?.title?.trim() || "Event";
  const dateLabel = formatLongDate(event?.eventDate);
  const timeLabel = formatTimeRange(event?.startTime, event?.endTime);
  const typeLabel = event?.service?.trim() || "—";
  const memberCount = event?.assignedList?.length ?? 0;
  const membersLabel = memberCount > 0 ? `${memberCount} Member${memberCount === 1 ? "" : "s"}` : "—";
  const description =
    event?.description?.trim() ||
    "No description has been provided for this event.";
  const address = event?.address?.trim() || "—";
  const locationTitle = address.includes(",") ? address.split(",")[0].trim() : address;
  const locationSubtitle = address.includes(",")
    ? address.slice(address.indexOf(",") + 1).trim()
    : "";

  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      containerProps={{ style: { paddingHorizontal: 0, paddingBottom: "4%" } }}
      scrollProps={{ showsVerticalScrollIndicator: false }}
    >
      {/* Header (match About/Privacy screens) */}
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
          <Text bold large24 style={{ color: "#fff" }} numberOfLines={3}>
            {title}
          </Text>

          <View row marginT-14>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Date
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }} numberOfLines={2}>
                {dateLabel}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Time
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }} numberOfLines={2}>
                {timeLabel}
              </Text>
            </View>
          </View>

          <View row marginT-10>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Type
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }} numberOfLines={2}>
                {typeLabel}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text extraSmall regular style={{ color: "#818898" }}>
                Members
              </Text>
              <Text small regular style={{ color: "#fff", marginTop: 6 }} numberOfLines={2}>
                {membersLabel}
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
            {description}
          </Text>
        </View>

        {/* Location + map */}
        <View marginT-18>
          <Text bold large20 style={{ color: "#fff" }}>
            Location
          </Text>
          <View row centerV marginT-12>
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
              style={{ width: "100%", height: moderateScale(140) }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Bottom action — switches on the current user's assignment status. */}
        <View marginT-26 marginB-10>
          {actionKind === "claim" && (
            <>
              <CustomButton
                label={
                  claimed
                    ? "Applied"
                    : claiming
                    ? "Applying…"
                    : "Claim this shift"
                }
                onPress={handleClaimShift}
                disabled={claiming || claimed || !event?.id}
                backgroundColor={claimed ? "#6C6C6C" : theme.color.primary}
                style={{ width: "100%" }}
              />
              <Text marginT-10 small regular style={{ color: "#F14336", textAlign: "center" }}>
                Apply for this job.
              </Text>
            </>
          )}

          {actionKind === "applied" && (
            <>
              <CustomButton
                label="Applied"
                disabled
                backgroundColor="#6C6C6C"
                style={{ width: "100%" }}
              />
              <Text marginT-10 small regular style={{ color: "#F14336", textAlign: "center" }}>
                You have already applied for this job.
              </Text>
            </>
          )}

          {actionKind === "rejected" && (
            <>
              <CustomButton
                label="Rejected"
                disabled
                backgroundColor="#6C6C6C"
                style={{ width: "100%" }}
              />
              <Text marginT-10 small regular style={{ color: "#F14336", textAlign: "center" }}>
                You were rejected for this job.
              </Text>
            </>
          )}

          {actionKind === "checkin" && (
            <>
              <CustomButton
                label="Check-In"
                onPress={() => router.push("/(main)/(provider)/StartJob")}
                backgroundColor={theme.color.primary}
                style={{ width: "100%" }}
              />
              <Text marginT-10 small regular style={{ color: "#F14336", textAlign: "center" }}>
                Please check-in once you arrive at the job site.
              </Text>
            </>
          )}

          {actionKind === "completed" && (
            <CustomButton
              label="Job Completed"
              disabled
              backgroundColor="#6C6C6C"
              style={{ width: "100%" }}
            />
          )}
        </View>
      </View>
    </Container>
  );
};

export default ProviderEventDetail;
