import Container from "@/components/Container";
import {
  Notification,
  NotificationActions,
} from "@/redux/actions/NotificationActions";
import { AppDispatch } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useDispatch } from "react-redux";
import { Text, View } from "react-native-ui-lib";

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

/**
 * Notifications row for the contractor tab.
 *
 * Compared to the customer variant:
 *   - The avatar always reads "Admin" — contractor-side notifications
 *     are system messages from the platform, so there's no per-sender
 *     profile to surface.
 *   - Tapping any row jumps to the provider's My Events tab (see
 *     `handleNotificationPress` below). We don't open the event detail
 *     directly because the notification payload doesn't currently
 *     guarantee a fresh event row.
 */
const Row = ({
  item,
  showDivider,
  onPress,
}: {
  item: Notification;
  showDivider: boolean;
  onPress: (n: Notification) => void;
}) => {
  const dateLabel = React.useMemo(
    () => formatLocalShortDate(item.createdAtIso),
    [item.createdAtIso]
  );

  return (
    <View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item)}>
        <View row paddingV-14>
          {/* Static "Admin" badge — replaces the per-user initials avatar
              used on the customer screen. */}
          <View
            center
            style={{
              width: moderateScale(44),
              height: moderateScale(44),
              borderRadius: moderateScale(22),
              backgroundColor: theme.color.primary,
            }}
          >
            <Text bold style={{ color: "#000", fontSize: moderateScale(10) }}>
              Admin
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
        <View style={{ height: 1, backgroundColor: "#2A2A2A" }} />
      ) : null}
    </View>
  );
};

type Section = {
  key: "today" | "earlier";
  title: string;
  items: Notification[];
};

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [list, setList] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

  /**
   * Tap handler — switches the contractor to the My Events tab. The
   * provider tabs are wired up with `@react-navigation/bottom-tabs`
   * (see `app/(main)/(provider)/(tabs)/_layout.tsx`), and the My Events
   * screen is registered under the route name `"myEvents"`. We use the
   * tab navigator handle directly because `router.push` from
   * expo-router won't switch tabs inside this nested navigator.
   *
   * Notifications are system messages and don't ship with a guaranteed
   * fresh event payload, so we route to the list screen rather than to
   * a specific detail page; that list re-fetches on focus.
   */
  const navigation = useNavigation();
  const handleNotificationPress = React.useCallback(
    (_n: Notification) => {
      // Cast to `any` because react-navigation's strict typing doesn't
      // know about the parent tab routes from this file.
      (navigation as any).getParent?.()?.navigate?.("myEvents") ??
        (navigation as any).navigate?.("myEvents");
    },
    [navigation]
  );

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
            "[Notifications][contractor] response:",
            JSON.stringify(rows, null, 2)
          );
          setList(rows);
        })
        .catch((err) => {
          if (cancelled) return;
          console.log("[Notifications][contractor] error:", err);
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
                    onPress={handleNotificationPress}
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </Container>
  );
};

export default Notifications;
