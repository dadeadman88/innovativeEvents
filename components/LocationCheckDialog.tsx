import CustomButton from "@/components/Button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import * as React from "react";
import { Platform } from "react-native";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { moderateScale } from "react-native-size-matters";
import { Dialog, Text, View } from "react-native-ui-lib";

type Coords = { latitude: number; longitude: number };

type LocationCheckDialogProps = {
  visible: boolean;
  /** Called when the user dismisses the dialog (Close button or backdrop). */
  onClose: () => void;
  /** Called when the user taps the Continue CTA (in-radius branch only). */
  onContinue: () => void;
  /** Pinned event location. Required for the dialog to render the map. */
  eventCoords: Coords | null;
  /** Device location at the moment the dialog opened. */
  userCoords: Coords | null;
  /** Whether `userCoords` is inside `radiusMeters` of `eventCoords`. */
  withinRadius: boolean;
  /** Straight-line distance (m) between the user and the event. */
  distance: number;
  /** Geofence radius drawn as the pulsing ring (e.g. 100). */
  radiusMeters: number;
  /** Action verb shown in helper copy. */
  action: "check-in" | "check-out";
  /**
   * `true` while the underlying API call is in flight. Disables the
   * Continue button and swaps its label for a "Please wait…" hint so
   * the dialog can't fire the same request twice.
   */
  busy?: boolean;
};

/**
 * RGB triplets for the pulsing geofence ring. Picked to read on top of
 * Google / Apple Maps' default street style without needing a stroke.
 */
const INSIDE_RGB = "16,185,129"; // emerald
const OUTSIDE_RGB = "239,68,68"; // red

/**
 * Mini-map confirmation popup used to gate contractor check-in and
 * check-out behind a 100m geofence. Renders:
 *   1. The event location (primary-color filled marker, center).
 *   2. The contractor's device location (green/red dot depending on
 *      whether they're inside the radius).
 *   3. A pulsing 100m ring around the event so the user can visually
 *      confirm whether their pin sits inside the gate.
 *
 * Two CTA states:
 *   - **inside the radius**  → "Continue" → calls `onContinue`.
 *   - **outside the radius** → "Close"    → calls `onClose`.
 *
 * Visual style mirrors the customer notification details popup: dark
 * `#1E1E1E` card, ~90% screen width, rounded corners.
 */
const LocationCheckDialog = ({
  visible,
  onClose,
  onContinue,
  eventCoords,
  userCoords,
  withinRadius,
  distance,
  radiusMeters,
  action,
  busy = false,
}: LocationCheckDialogProps) => {
  // Pulse the geofence ring while the dialog is open. ~12fps re-renders
  // of a single Circle is cheap; we stop the interval the moment the
  // dialog hides so the timer doesn't keep firing in the background.
  const [pulse, setPulse] = React.useState(0);
  React.useEffect(() => {
    if (!visible) return;
    let phase = 0;
    const id = setInterval(() => {
      phase = (phase + 1) % 60;
      setPulse(phase);
    }, 80);
    return () => clearInterval(id);
  }, [visible]);

  // Sin wave 0..1 so the ring eases in/out instead of stepping.
  const t = 0.5 * (1 + Math.sin((pulse / 60) * 2 * Math.PI));
  const fillOpacity = 0.12 + 0.18 * t;
  const strokeOpacity = 0.55 + 0.45 * t;

  const ringRgb = withinRadius ? INSIDE_RGB : OUTSIDE_RGB;
  const fillColor = `rgba(${ringRgb},${fillOpacity})`;
  const strokeColor = `rgba(${ringRgb},${strokeOpacity})`;

  /**
   * Region that frames both pins comfortably. Falls back to a tight
   * zoom on the event location when we don't have user coords.
   */
  const initialRegion = React.useMemo<Region | null>(() => {
    if (!eventCoords) return null;
    if (!userCoords) {
      return {
        latitude: eventCoords.latitude,
        longitude: eventCoords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
    }
    const minLat = Math.min(eventCoords.latitude, userCoords.latitude);
    const maxLat = Math.max(eventCoords.latitude, userCoords.latitude);
    const minLng = Math.min(eventCoords.longitude, userCoords.longitude);
    const maxLng = Math.max(eventCoords.longitude, userCoords.longitude);
    const padFactor = 1.7;
    const minDelta = 0.005;
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * padFactor, minDelta),
      longitudeDelta: Math.max((maxLng - minLng) * padFactor, minDelta),
    };
  }, [eventCoords, userCoords]);

  const actionVerb = action === "check-in" ? "check in" : "check out";
  const title = withinRadius
    ? "You're inside the location"
    : "You're outside the location";
  const subtitle = withinRadius
    ? `Tap Continue to ${actionVerb}.`
    : `You're ${Math.round(distance)} meters from the event. Move closer to ${actionVerb}.`;

  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      width={SCREEN_WIDTH * 0.9}
      height={SCREEN_HEIGHT * 0.7}
      center
      containerStyle={{
        borderRadius: moderateScale(18),
        backgroundColor: "#1E1E1E",
      }}
      ignoreBackgroundPress
    >
      <View flex padding-16>
        <Text bold large20 center style={{ color: "#fff" }}>
          {title}
        </Text>
        <Text small regular center marginT-6 style={{ color: "#A0A0A0" }}>
          {subtitle}
        </Text>

        <View
          flex
          marginT-14
          style={{
            borderRadius: moderateScale(14),
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          {eventCoords && initialRegion ? (
            <MapView
              style={{ flex: 1 }}
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
              initialRegion={initialRegion}
              scrollEnabled
              zoomEnabled
              rotateEnabled={false}
              pitchEnabled={false}
              showsCompass={false}
            >
              {/* Pulsing geofence ring around the event. Color follows
                  the in/out status so the user gets instant feedback. */}
              <Circle
                center={eventCoords}
                radius={radiusMeters}
                fillColor={fillColor}
                strokeColor={strokeColor}
                strokeWidth={2}
              />

              {/* Event marker — primary color circle, larger so it
                  visually anchors as the "venue" pin. */}
              <Marker
                coordinate={eventCoords}
                anchor={{ x: 0.5, y: 0.5 }}
                title="Event location"
              >
                <View
                  center
                  style={{
                    width: moderateScale(24),
                    height: moderateScale(24),
                    borderRadius: moderateScale(12),
                    backgroundColor: theme.color.primary,
                    borderWidth: 3,
                    borderColor: "#fff",
                  }}
                />
              </Marker>

              {/* User marker — green/red so it always reads as
                  "you're good" or "you're too far". */}
              {userCoords ? (
                <Marker
                  coordinate={userCoords}
                  anchor={{ x: 0.5, y: 0.5 }}
                  title="Your location"
                >
                  <View
                    center
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      borderRadius: moderateScale(10),
                      backgroundColor: withinRadius ? "#10B981" : "#EF4444",
                      borderWidth: 3,
                      borderColor: "#fff",
                    }}
                  />
                </Marker>
              ) : null}
            </MapView>
          ) : null}
        </View>

        {withinRadius ? (
          <CustomButton
            marginT-14
            label={busy ? "Please wait…" : "Continue"}
            onPress={onContinue}
            disabled={busy}
            style={{ width: "100%" }}
          />
        ) : (
          <CustomButton
            marginT-14
            label="Close"
            onPress={onClose}
            style={{ width: "100%" }}
          />
        )}
      </View>
    </Dialog>
  );
};

export default LocationCheckDialog;
