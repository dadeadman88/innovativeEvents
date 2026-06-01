import CustomButton from "@/components/Button";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { setPickedLocation } from "@/redux/slices/LocationSlice";
import { AppDispatch } from "@/redux/store";
import {
  GOOGLE_MAPS_API_KEY,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import * as Location from "expo-location";
import { router } from "expo-router";
import * as React from "react";
import { ActivityIndicator, FlatList, Platform, StatusBar } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  MarkerDragStartEndEvent,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { moderateScale } from "react-native-size-matters";
import {
  Dialog,
  Text,
  ToastPresets,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { useDispatch } from "react-redux";

/**
 * Single suggestion returned by the Places Autocomplete API. Stripped to
 * the fields we actually render and need for the follow-up Place Details
 * call.
 */
type PlaceSuggestion = {
  placeId: string;
  description: string;
  primary?: string;
  secondary?: string;
};

/** A point on the map (always the source of truth for pin position). */
type Coords = {
  latitude: number;
  longitude: number;
};

/**
 * Sensible default region used when location permission is denied or the
 * device fix can't be acquired. Drops the user near downtown San
 * Francisco rather than (0,0) in the middle of the Atlantic.
 */
const FALLBACK_COORDS: Coords = {
  latitude: 37.7749,
  longitude: -122.4194,
};

const DEFAULT_DELTA = {
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

/** Reverse-geocode lat/lng → "formatted" address using the Google API. */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json?.status !== "OK") {
    console.log("[chooseLocation] reverseGeocode non-OK status:", json?.status, json?.error_message);
  }
  const formatted = json?.results?.[0]?.formatted_address;
  return typeof formatted === "string" ? formatted : "";
}

/** Forward-geocode for autocomplete suggestions via the Places API. */
async function fetchAutocomplete(input: string): Promise<PlaceSuggestion[]> {
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json?.status !== "OK" && json?.status !== "ZERO_RESULTS") {
    console.log("[chooseLocation] autocomplete non-OK status:", json?.status, json?.error_message);
  }
  const preds = Array.isArray(json?.predictions) ? json.predictions : [];
  return preds.map((p: any) => ({
    placeId: String(p?.place_id ?? ""),
    description: String(p?.description ?? ""),
    primary: p?.structured_formatting?.main_text,
    secondary: p?.structured_formatting?.secondary_text,
  }));
}

/**
 * Pull lat/lng + formatted address for a place id picked from the
 * autocomplete list. Returns `null` if the API call fails.
 */
async function fetchPlaceDetails(placeId: string): Promise<{
  coords: Coords;
  address: string;
} | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
    placeId
  )}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json?.status !== "OK") {
    console.log("[chooseLocation] placeDetails non-OK status:", json?.status, json?.error_message);
    return null;
  }
  const lat = json?.result?.geometry?.location?.lat;
  const lng = json?.result?.geometry?.location?.lng;
  const address = json?.result?.formatted_address ?? "";
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return {
    coords: { latitude: lat, longitude: lng },
    address: typeof address === "string" ? address : "",
  };
}

const ChooseLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  const mapRef = React.useRef<MapView | null>(null);

  // Pin state — `coords` always reflects the marker position. The map
  // region is animated to follow it but isn't used as the source of
  // truth (so dragging the map alone doesn't change the pick).
  const [coords, setCoords] = React.useState<Coords | null>(null);
  const [address, setAddress] = React.useState<string>("");
  const [resolvingAddress, setResolvingAddress] = React.useState(false);
  const [acquiringFix, setAcquiringFix] = React.useState(true);

  // Bottom sheet (search) state.
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [results, setResults] = React.useState<PlaceSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);

  /**
   * Drop the marker, animate the map there, and kick off a reverse
   * geocode in parallel. Used by:
   *   - initial location fix on mount
   *   - marker drag end
   *   - tapping anywhere on the map
   *   - selecting a place from the autocomplete list
   */
  const dropPin = React.useCallback(
    async (next: Coords, opts?: { addressOverride?: string; animate?: boolean }) => {
      setCoords(next);
      if (opts?.animate !== false) {
        mapRef.current?.animateToRegion(
          { ...next, ...DEFAULT_DELTA },
          400
        );
      }

      if (typeof opts?.addressOverride === "string") {
        setAddress(opts.addressOverride);
        return;
      }

      setResolvingAddress(true);
      try {
        const formatted = await reverseGeocode(next.latitude, next.longitude);
        setAddress(formatted);
      } catch (err) {
        console.log("[chooseLocation] reverseGeocode failed:", err);
      } finally {
        setResolvingAddress(false);
      }
    },
    []
  );

  // Initial location fix.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setAcquiringFix(true);
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Toaster({
            visible: true,
            preset: ToastPresets.FAILURE,
            message:
              "Location permission denied. Drag the pin or search to pick an address.",
          });
          if (!cancelled) await dropPin(FALLBACK_COORDS);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        await dropPin({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch (err) {
        console.log("[chooseLocation] getCurrentPositionAsync failed:", err);
        if (!cancelled) await dropPin(FALLBACK_COORDS);
      } finally {
        if (!cancelled) setAcquiringFix(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dropPin, Toaster]);

  // Debounced autocomplete search.
  React.useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const handle = setTimeout(async () => {
      try {
        const preds = await fetchAutocomplete(q);
        setResults(preds);
      } catch (err) {
        console.log("[chooseLocation] autocomplete failed:", err);
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  const onMarkerDragEnd = React.useCallback(
    (e: MarkerDragStartEndEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      dropPin({ latitude, longitude }, { animate: false });
    },
    [dropPin]
  );

  const onMapPress = React.useCallback(
    (e: MapPressEvent) => {
      const { latitude, longitude } = e.nativeEvent.coordinate;
      dropPin({ latitude, longitude });
    },
    [dropPin]
  );

  const onSelectSuggestion = React.useCallback(
    async (placeId: string) => {
      setSearchLoading(true);
      try {
        const detail = await fetchPlaceDetails(placeId);
        if (!detail) {
          Toaster({
            visible: true,
            preset: ToastPresets.FAILURE,
            message: "Couldn't load that location.",
          });
          return;
        }
        await dropPin(detail.coords, { addressOverride: detail.address });
        setSearchOpen(false);
        setSearchQuery("");
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [dropPin, Toaster]
  );

  const onConfirm = React.useCallback(() => {
    if (!coords) {
      Toaster({
        visible: true,
        preset: ToastPresets.FAILURE,
        message: "Please pick a location first.",
      });
      return;
    }
    if (!address.trim()) {
      Toaster({
        visible: true,
        preset: ToastPresets.FAILURE,
        message: "Address is still being resolved.",
      });
      return;
    }
    dispatch(
      setPickedLocation({
        address: address.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
      })
    );
    router.back();
  }, [coords, address, dispatch, Toaster]);

  return (
    <View flex bg-black>
      <StatusBar barStyle="dark-content" />

      <MapView
        ref={(r) => {
          mapRef.current = r;
        }}
        style={{ flex: 1 }}
        // Google Maps on Android (with the API key in AndroidManifest);
        // on iOS we let it fall back to Apple Maps to avoid the extra
        // GoogleMaps SDK Pod setup. Geocoding/autocomplete still uses
        // the Google web APIs in both cases.
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{ ...FALLBACK_COORDS, ...DEFAULT_DELTA } as Region}
        onPress={onMapPress}
      >
        {coords ? (
          <Marker
            coordinate={coords}
            draggable
            onDragEnd={onMarkerDragEnd}
            pinColor={theme.color.primary}
          />
        ) : null}
      </MapView>

      {/* Top bar: back button + search trigger. Sits over the map. */}
      <View
        absT
        row
        spread
        centerV
        paddingH-20
        paddingT-10
        width={SCREEN_WIDTH}
        style={{ marginTop: moderateScale(40) }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          center
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            borderRadius: moderateScale(20),
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Icon vector="Ionicons" name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        <Text
          semibold
          regularSize
          style={{
            flex: 1,
            textAlign: "center",
            color: "#fff",
            textShadowColor: "rgba(0,0,0,0.6)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
          }}
        >
          Choose your location
        </Text>

        <TouchableOpacity
          onPress={() => setSearchOpen(true)}
          center
          style={{
            width: moderateScale(40),
            height: moderateScale(40),
            borderRadius: moderateScale(20),
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Icon vector="Feather" name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Loading overlay while we wait for the initial GPS fix. Doesn't
          block taps so the user can still pan the map if they want. */}
      {acquiringFix ? (
        <View
          absT
          centerH
          style={{
            top: moderateScale(110),
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: moderateScale(20),
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color={theme.color.primary} />
          <Text white small marginL-8>
            Locating you…
          </Text>
        </View>
      ) : null}

      {/* Bottom card: shows the picked address and a confirm CTA.
          Extra `paddingBottom` keeps the Confirm button clear of the
          home indicator / nav bar on devices with a tall safe area. */}
      <View
        absB
        paddingH-20
        paddingT-14
        width={SCREEN_WIDTH}
        style={{
          backgroundColor: "#1E1E1E",
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
          paddingBottom: moderateScale(36),
        }}
      >
        <Text small regular style={{ color: "#818898" }}>
          Selected location
        </Text>
        <View row centerV marginT-8>
          <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
          <View flex marginL-8>
            {resolvingAddress ? (
              <View row centerV>
                <ActivityIndicator size="small" color={theme.color.primary} />
                <Text regular small marginL-8 style={{ color: "#fff" }}>
                  Resolving address…
                </Text>
              </View>
            ) : (
              <Text
                regular
                small
                numberOfLines={2}
                style={{ color: "#fff" }}
              >
                {address || "Drag the pin or tap on the map to choose a location."}
              </Text>
            )}
          </View>
        </View>
        <CustomButton
          marginT-14
          label="Confirm Location"
          onPress={onConfirm}
          disabled={!coords || !address.trim() || resolvingAddress}
        />
      </View>

      {/* Search bottom sheet — autocomplete results from Places API. */}
      <Dialog
        visible={searchOpen}
        onDismiss={() => setSearchOpen(false)}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT * 0.6}
        bottom
        containerStyle={{
          borderRadius: 0,
          borderTopLeftRadius: moderateScale(25),
          borderTopRightRadius: moderateScale(25),
          backgroundColor: "#fff",
        }}
      >
        <View flex paddingH-20 paddingT-20>
          <View centerH marginB-15>
            <View
              width={moderateScale(40)}
              height={moderateScale(4)}
              br100
              style={{ backgroundColor: "#E5E5E5" }}
            />
          </View>

          <Input
            placeholder="Search for an address…"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            leadingAccessory={
              <Icon
                vector="Feather"
                name="search"
                size={20}
                color={theme.color.lightGray}
              />
            }
          />

          <Text black semibold regularSize marginT-20 marginB-10>
            {searchQuery.trim().length >= 3 ? "Search Results" : "Type to search"}
          </Text>

          <FlatList
            data={results}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                row
                centerV
                paddingV-15
                onPress={() => onSelectSuggestion(item.placeId)}
                style={{ borderBottomWidth: 1, borderColor: "#F0F0F0" }}
              >
                <Icon
                  vector="Ionicons"
                  name="location"
                  size={22}
                  color={theme.color.primary}
                />
                <View flex marginL-12>
                  <Text
                    semibold
                    regularSize
                    numberOfLines={1}
                    style={{ color: "#000" }}
                  >
                    {item.primary || item.description}
                  </Text>
                  {item.secondary ? (
                    <Text
                      regular
                      small
                      marginT-2
                      numberOfLines={1}
                      style={{ color: "#555" }}
                    >
                      {item.secondary}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View centerH marginT-20>
                {searchLoading ? (
                  <ActivityIndicator color={theme.color.primary} />
                ) : (
                  <Text gray regular small>
                    {searchQuery.trim().length >= 3
                      ? "No locations found"
                      : "Start typing at least 3 characters to search."}
                  </Text>
                )}
              </View>
            }
          />
        </View>
      </Dialog>
    </View>
  );
};

export default ChooseLocation;
