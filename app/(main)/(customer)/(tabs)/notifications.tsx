import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import {
  Notification,
  NotificationActions,
} from "@/redux/actions/NotificationActions";
import { AppDispatch } from "@/redux/store";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useDispatch } from "react-redux";
import { Dialog, Text, View } from "react-native-ui-lib";

/**
 * Build a 1–2 character initials string from a notification's `from`
 * payload. Prefers `first_name + last_name`, falls back to the first two
 * tokens of `fullname`, then to a placeholder dot.
 */
function initialsFor(from?: Notification["from"]): string {
  if (!from) return "•";
  const first = from.firstName?.trim() ?? "";
  const last = from.lastName?.trim() ?? "";
  if (first || last) {
    const a = first ? first[0] : "";
    const b = last ? last[0] : "";
    const combined = `${a}${b}`.toUpperCase();
    return combined || "•";
  }
  const fullname = from.fullname?.trim() ?? "";
  if (fullname) {
    const parts = fullname.split(/\s+/).filter(Boolean).slice(0, 2);
    const combined = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
    return combined || "•";
  }
  return "•";
}

/**
 * "Jun 1" for notifications from the current calendar year, "Jun 1, 2024"
 * for older ones. The backend doesn't send a wall-clock time yet, so we
 * use the date as the right-side timestamp on each row.
 */
function formatLocalShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const now = new Date();
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Same calendar day as `now`, evaluated in the **device's local** TZ.
 * The `created_date` was stored as UTC and parsed as UTC, but the user
 * thinks of "today" in their own timezone, so we compare on the local
 * Y/M/D triple.
 */
function isLocalToday(iso: string, now: Date): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return false;
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const Row = ({
  item,
  showDivider,
  onPress,
}: {
  item: Notification;
  showDivider: boolean;
  onPress: (n: Notification) => void;
}) => {
  const initials = React.useMemo(() => initialsFor(item.from), [item.from]);
  const dateLabel = React.useMemo(
    () => formatLocalShortDate(item.createdAtIso),
    [item.createdAtIso]
  );

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(item)}
      >
      <View row paddingV-14>
        {/* Avatar replacement — solid circle with the sender's initials. */}
        <View
          center
          style={{
            width: moderateScale(44),
            height: moderateScale(44),
            borderRadius: moderateScale(22),
            backgroundColor: theme.color.primary,
          }}
        >
          <Text bold small style={{ color: "#000" }}>
            {initials}
          </Text>
        </View>
        <View flex marginL-12>
          <View row spread>
            <Text
              semibold
              regularSize
              numberOfLines={2}
              style={{ color: "#fff", flex: 1, marginRight: 8 }}
            >
              {item.title}
            </Text>
            {!!dateLabel && (
              <Text
                extraSmall
                regular
                numberOfLines={1}
                style={{ color: "#818898" }}
              >
                {dateLabel}
              </Text>
            )}
          </View>
          {!!item.message && (
            <Text
              marginT-6
              small
              regular
              numberOfLines={2}
              style={{ color: "#818898", lineHeight: moderateScale(18) }}
            >
              {item.message}
            </Text>
          )}
        </View>
      </View>
      </TouchableOpacity>
      {showDivider ? (
        <View
          style={{
            height: 1,
            backgroundColor: "#2A2A2A",
          }}
        />
      ) : null}
    </View>
  );
};

type Section = {
  key: "today" | "earlier";
  title: string;
  items: Notification[];
};

/**
 * Modal popup shown when a notification row is tapped.
 *
 * Layout (top → bottom):
 *   1. Notification message — short paragraph at the top, gives context
 *      for who/why this profile is being surfaced.
 *   2. Profile card — large initials avatar centered, with the sender's
 *      full name and email stacked below.
 *   3. Close button.
 *
 * Visual style mirrors `SuccessDialog` (centered react-native-ui-lib
 * `Dialog`, ~85% screen width, rounded white card) so the app's modals
 * look consistent across the logout / event-created / etc. flows.
 */
const NotificationDetailsDialog = ({
  notification,
  onClose,
}: {
  notification: Notification | null;
  onClose: () => void;
}) => {
  const visible = !!notification;
  const initials = React.useMemo(
    () => initialsFor(notification?.from),
    [notification?.from]
  );

  // Build "First Last" from `first_name` + `last_name`. Falls back to
  // `fullname` if either piece is missing so the row never renders blank.
  const fullName = React.useMemo(() => {
    const f = notification?.from;
    if (!f) return "";
    const first = f.firstName?.trim() ?? "";
    const last = f.lastName?.trim() ?? "";
    const joined = [first, last].filter(Boolean).join(" ").trim();
    if (joined) return joined;
    return f.fullname?.trim() ?? "";
  }, [notification?.from]);

  const email = notification?.from?.email?.trim() ?? "";
  const message = notification?.message?.trim() ?? "";

  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      width={SCREEN_WIDTH * 0.85}
      height={SCREEN_HEIGHT * 0.55}
      center
      containerStyle={{
        borderRadius: moderateScale(15),
        backgroundColor: "#1E1E1E",
      }}
      ignoreBackgroundPress
    >
      <View flex padding-20>
        {!!message && (
          <Text
            center
            small
            regular
            style={{ color: "#fff", lineHeight: moderateScale(20) }}
          >
            {message}
          </Text>
        )}

        <View flex center marginT-20>
          <View
            center
            style={{
              width: moderateScale(96),
              height: moderateScale(96),
              borderRadius: moderateScale(48),
              backgroundColor: theme.color.primary,
            }}
          >
            <Text bold large24 style={{ color: "#000" }}>
              {initials}
            </Text>
          </View>

          {!!fullName && (
            <Text
              bold
              large20
              marginT-18
              style={{ color: "#fff", textAlign: "center" }}
            >
              {fullName}
            </Text>
          )}
          {!!email && (
            <Text
              marginT-6
              small
              regular
              style={{ color: "#fff", textAlign: "center", opacity: 0.8 }}
            >
              {email}
            </Text>
          )}
        </View>

        <CustomButton
          marginT-20
          label="Close"
          onPress={onClose}
          style={{ width: "100%" }}
        />
      </View>
    </Dialog>
  );
};

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [list, setList] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  /**
   * The notification whose sender profile is being shown in the popup.
   * `null` hides the dialog.
   */
  const [selectedNotification, setSelectedNotification] =
    React.useState<Notification | null>(null);

  /**
   * Refetch every time the tab regains focus so the contractor sees
   * fresh data without pull-to-refresh.
   */
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      setLoading(true);
      dispatch(NotificationActions.FetchNotifications())
        .unwrap()
        .then((rows) => {
          if (cancelled) return;
          console.log(
            "[Notifications][customer] response:",
            JSON.stringify(rows, null, 2)
          );
          setList(rows);
        })
        .catch((err) => {
          if (cancelled) return;
          console.log("[Notifications][customer] error:", err);
          setList([]);
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
          setHasLoadedOnce(true);
        });
      return () => {
        cancelled = true;
      };
    }, [dispatch])
  );

  /**
   * Bucket the flat list into "Today" and "Earlier" sections based on
   * the device-local interpretation of each notification's UTC
   * `createdAtIso`. Items with no parseable date fall into "Earlier" so
   * they don't disappear from the UI.
   */
  const sections = React.useMemo<Section[]>(() => {
    const now = new Date();
    const today: Notification[] = [];
    const earlier: Notification[] = [];
    for (const n of list) {
      if (n.createdAtIso && isLocalToday(n.createdAtIso, now)) {
        today.push(n);
      } else {
        earlier.push(n);
      }
    }
    const out: Section[] = [];
    if (today.length) out.push({ key: "today", title: "Today", items: today });
    if (earlier.length)
      out.push({ key: "earlier", title: "Earlier", items: earlier });
    return out;
  }, [list]);

  const showEmpty = hasLoadedOnce && !loading && list.length === 0;

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
      {/* Centered title (tab screen, no back) */}
      <View row centerV>
        <View width={moderateScale(44)} />
        <View flex center>
          <Text semibold regularSize style={{ color: "#fff" }}>
            Notifications
          </Text>
        </View>
        <View width={moderateScale(44)} />
      </View>

      {loading && !hasLoadedOnce ? (
        <View flex center>
          <ActivityIndicator color={theme.color.primary} />
        </View>
      ) : showEmpty ? (
        <View flex center paddingH-24>
          <Text small regular style={{ color: "#818898", textAlign: "center" }}>
            You don&apos;t have any notifications yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => s.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: moderateScale(18),
            paddingBottom: moderateScale(24),
          }}
          renderItem={({ item, index }) => (
            <View style={{ marginTop: index === 0 ? 0 : moderateScale(28) }}>
              <Text bold large20 style={{ color: "#fff" }}>
                {item.title}
              </Text>
              <View marginT-12>
                {item.items.map((n, idx) => (
                  <Row
                    key={n.id}
                    item={n}
                    showDivider={idx !== item.items.length - 1}
                    onPress={setSelectedNotification}
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}

      <NotificationDetailsDialog
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </Container>
  );
};

export default Notifications;
