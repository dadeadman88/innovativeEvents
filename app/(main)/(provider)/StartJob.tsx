import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import LocationCheckDialog from "@/components/LocationCheckDialog";
import { EventActions, EventTask } from "@/redux/actions/EventActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { resetCheckIn, startCheckIn } from "@/redux/slices/EventSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { CHECKIN_RADIUS_METERS, distanceMeters } from "@/utils/distance";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import {
    Image,
    Text,
    ToastPresets,
    TouchableOpacity,
    View,
} from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

/** Format seconds (>=0) into a zero-padded 2-digit string. */
function pad2(n: number): string {
    const v = Math.max(0, Math.floor(n));
    return v < 10 ? `0${v}` : String(v);
}

/**
 * Break a duration in seconds into clamped {hours, minutes, seconds}
 * components for the session-time card. Hours are capped at 99 so the UI
 * never breaks if a forgotten check-in runs for days.
 */
function splitDuration(totalSeconds: number): {
    hours: string;
    minutes: string;
    seconds: string;
} {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.min(99, Math.floor(safe / 3600));
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return {
        hours: pad2(hours),
        minutes: pad2(minutes),
        seconds: pad2(seconds),
    };
}

type EvidencePhoto = {
    uri: string;
    mimeType?: string | null;
    fileName?: string | null;
};

const StartJob = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { Toaster } = useToast();

    /**
     * The event id is forwarded from `providerEventDetail` after a successful
     * `event/checkin/add` POST. We read the live event object from the redux
     * events slice so we always reflect the latest data (title, tasks, etc.)
     * rather than a snapshot stuffed into URL params.
     */
    const { eventId: eventIdParam } = useLocalSearchParams<{ eventId?: string }>();
    const eventId = Array.isArray(eventIdParam) ? eventIdParam[0] : eventIdParam;
    const event = useSelector((s: RootState) =>
        eventId ? s.events.byId[eventId] ?? null : null
    );

    /**
     * Wall-clock timestamp of the contractor's first successful check-in for
     * this event. Stored in redux so the elapsed time keeps growing across
     * navigation — re-entering this screen "resumes" the timer instead of
     * resetting it. Subsequent check-ins for the same event leave this value
     * untouched (see `startCheckIn` in EventSlice).
     */
    const startedAt = useSelector((s: RootState) =>
        eventId ? s.events.checkInStartedAtById[eventId] ?? null : null
    );

    /**
     * Defensive fallback: if we somehow landed on this screen with a known
     * event but no recorded start time (e.g. a hot reload, or a future deep
     * link that bypasses the detail screen), seed the timer to "now". The
     * reducer is a no-op when a start time already exists, so this can't
     * accidentally reset an already-running timer.
     */
    React.useEffect(() => {
        if (!eventId) return;
        if (startedAt != null) return;
        dispatch(startCheckIn({ eventId }));
    }, [dispatch, eventId, startedAt]);

    /**
     * Re-render once a second so the elapsed time string updates. We just
     * track `now` locally — the source of truth (`startedAt`) lives in redux
     * and is shared across mounts.
     */
    const [now, setNow] = React.useState(() => Date.now());
    React.useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const elapsedSeconds = React.useMemo(() => {
        if (startedAt == null) return 0;
        return Math.max(0, Math.floor((now - startedAt) / 1000));
    }, [now, startedAt]);

    const { hours, minutes, seconds } = React.useMemo(
        () => splitDuration(elapsedSeconds),
        [elapsedSeconds]
    );

    const headerTitle = event?.title?.trim()
        ? event.title
        : eventId
        ? `Job #${eventId}`
        : "Job";

    /**
     * Build the Required-Tasks list from `event.tasks` (set by the customer
     * during event creation). Each entry preserves the backend `id` so we
     * can send the completed task ids back to `event/checkout/add`.
     *
     * Per-row completion state is tracked locally — the backend doesn't
     * return per-task progress yet, so this is purely UI state scoped to
     * the screen mount.
     */
    const taskItems = React.useMemo<EventTask[]>(() => {
        const list = event?.tasks ?? [];
        return list.filter((t): t is EventTask => !!t && !!t.name && !!t.name.trim());
    }, [event?.tasks]);

    const [doneByIndex, setDoneByIndex] = React.useState<Record<number, boolean>>({});
    const toggleTask = React.useCallback((idx: number) => {
        setDoneByIndex((prev) => ({ ...prev, [idx]: !prev[idx] }));
    }, []);

    const completedCount = React.useMemo(
        () => taskItems.reduce((acc, _t, i) => acc + (doneByIndex[i] ? 1 : 0), 0),
        [taskItems, doneByIndex]
    );
    const totalCount = taskItems.length;
    const progress = totalCount === 0 ? 0 : completedCount / totalCount;

    /**
     * Evidence photo for the job. Required at check-out time.
     *
     * Tapping the "UPLOAD PHOTO" tile opens the image library and stores
     * the picked asset here; the placeholder on the right then renders the
     * thumbnail with a close button overlay (same pattern as
     * `verifyProvider.tsx`).
     */
    const [evidencePhoto, setEvidencePhoto] = React.useState<EvidencePhoto | null>(null);
    const [photoPickerBusy, setPhotoPickerBusy] = React.useState(false);

    const handlePickPhoto = React.useCallback(async () => {
        if (photoPickerBusy) return;
        setPhotoPickerBusy(true);
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Toaster({
                    visible: true,
                    preset: ToastPresets.FAILURE,
                    message: "Photo library access is required to upload evidence.",
                });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsMultipleSelection: false,
                quality: 0,
                exif: false,
                preferredAssetRepresentationMode:
                    ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
            });

            if (result.canceled || !result.assets?.[0]?.uri) return;

            const asset = result.assets[0];
            setEvidencePhoto({
                uri: asset.uri,
                mimeType: asset.mimeType,
                fileName: asset.fileName,
            });
        } finally {
            setPhotoPickerBusy(false);
        }
    }, [photoPickerBusy, Toaster]);

    const removeEvidencePhoto = React.useCallback(() => {
        setEvidencePhoto(null);
    }, []);

    const [checkingOut, setCheckingOut] = React.useState(false);

    /**
     * Geofence-confirmation popup state for check-out. Same shape as
     * the check-in dialog state on `providerEventDetail.tsx` — see that
     * file for the rationale.
     *
     * `pendingTaskIds` snapshots the task ids at the moment Check-Out
     * was tapped so the API call running off the dialog "Continue" uses
     * the exact same payload the user just confirmed, even if the task
     * list re-renders for any reason while the dialog is open.
     */
    const [checkoutDialog, setCheckoutDialog] = React.useState<{
        visible: boolean;
        userCoords: { latitude: number; longitude: number } | null;
        withinRadius: boolean;
        distance: number;
        busy: boolean;
        pendingTaskIds: string[];
    }>({
        visible: false,
        userCoords: null,
        withinRadius: false,
        distance: 0,
        busy: false,
        pendingTaskIds: [],
    });

    const closeCheckoutDialog = React.useCallback(() => {
        setCheckoutDialog({
            visible: false,
            userCoords: null,
            withinRadius: false,
            distance: 0,
            busy: false,
            pendingTaskIds: [],
        });
    }, []);

    /**
     * Gate the Check-Out flow on:
     *   1. Every required task is checked off (only enforced when there's
     *      at least one task — events without a tasks list skip this).
     *   2. The contractor has uploaded an evidence photo.
     *
     * Once both gates pass we POST to `event/checkout/add` with the event
     * id, a hard-coded "Job completed" description, and the list of
     * backend task ids. The evidence photo is intentionally NOT uploaded
     * here per the current product spec (JSON body only).
     *
     * On success the session timer for this event is cleared, a success
     * toast is shown, and we replace navigation back to the provider home
     * tab. `replace` (instead of `push`) is deliberate: there's no useful
     * back-target inside a completed job's StartJob screen, and the home
     * tab's `useFocusEffect` will refetch the assignment list so the
     * event's status badge flips to "completed" automatically.
     *
     * Failures show a clear toast pointing at the missing piece. Tasks are
     * checked first so the contractor finishes the work before being told
     * to take a photo of it.
     */
    /**
     * Hit `event/checkout/add` and continue home. Both the
     * geofence-confirmed path (dialog Continue) and the no-event-coords
     * fallback path call this helper. Always resets the session timer
     * for this event on success — see `EventSlice.resetCheckIn`.
     */
    const performCheckout = React.useCallback(
        async (currentEventId: string, taskIds: string[]) => {
            try {
                await dispatch(
                    EventActions.ContractorCheckout({
                        eventId: currentEventId,
                        taskIds,
                        description: "Job completed",
                    })
                ).unwrap();
                dispatch(resetCheckIn({ eventId: currentEventId }));
                Toaster({
                    visible: true,
                    preset: ToastPresets.SUCCESS,
                    message: "Job completed successfully.",
                });
                router.replace("/(main)/(provider)/(tabs)/home");
            } catch {
                Toaster({
                    visible: true,
                    preset: ToastPresets.FAILURE,
                    message: "Checkout couldn't be completed, please try again.",
                });
            }
        },
        [dispatch, Toaster]
    );

    /**
     * Tap on Check-Out:
     *   1. Run the existing UI-side validations (tasks done, photo
     *      uploaded, event id present).
     *   2. Snapshot the task ids that will be submitted.
     *   3. If the event has pinned coordinates, fetch a device fix and
     *      open the LocationCheckDialog. The dialog renders the map
     *      with the pulsing 100m geofence ring; "Continue" calls
     *      `performCheckout`, "Close" backs out with no API call.
     *   4. Otherwise (older event with no coords) call `performCheckout`
     *      directly — preserves the legacy behavior.
     *
     * The location prompt comes AFTER task / photo validations so the
     * user finishes their work before being asked for GPS permission.
     */
    const handleCheckOutPress = React.useCallback(async () => {
        if (checkingOut) return;
        if (totalCount > 0 && completedCount < totalCount) {
            Toaster({
                visible: true,
                preset: ToastPresets.FAILURE,
                message: "Please complete all required tasks before checking out.",
            });
            return;
        }
        if (!evidencePhoto) {
            Toaster({
                visible: true,
                preset: ToastPresets.FAILURE,
                message: "Please upload a photo before checking out.",
            });
            return;
        }
        if (!eventId) {
            Toaster({
                visible: true,
                preset: ToastPresets.FAILURE,
                message: "Couldn't determine which job to check out.",
            });
            return;
        }

        const taskIds = taskItems
            .map((t) => t.id)
            .filter((id): id is string => !!id && !!id.trim());

        const hasEventCoords =
            event &&
            typeof event.latitude === "number" &&
            typeof event.longitude === "number" &&
            Number.isFinite(event.latitude) &&
            Number.isFinite(event.longitude);

        if (hasEventCoords) {
            // Acquire a fresh fix, then hand off to the popup. The
            // dialog "Continue" handler will run the actual API call.
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Toaster({
                        visible: true,
                        message: "Location permission is required to check out.",
                        preset: ToastPresets.FAILURE,
                    });
                    return;
                }
                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                const userCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                const meters = distanceMeters(userCoords, {
                    latitude: event!.latitude!,
                    longitude: event!.longitude!,
                });
                const within = meters <= CHECKIN_RADIUS_METERS;
                setCheckoutDialog({
                    visible: true,
                    userCoords,
                    withinRadius: within,
                    distance: meters,
                    busy: false,
                    pendingTaskIds: taskIds,
                });
                if (!within) {
                    Toaster({
                        visible: true,
                        preset: ToastPresets.FAILURE,
                        message: "You are outside the location.",
                    });
                }
            } catch {
                Toaster({
                    visible: true,
                    preset: ToastPresets.FAILURE,
                    message:
                        "Couldn't get your location. Make sure GPS is on and try again.",
                });
            }
            return;
        }

        // Legacy path — no event coords, hit the API directly.
        setCheckingOut(true);
        try {
            await performCheckout(eventId, taskIds);
        } finally {
            setCheckingOut(false);
        }
    }, [
        checkingOut,
        totalCount,
        completedCount,
        evidencePhoto,
        eventId,
        event,
        taskItems,
        Toaster,
        performCheckout,
    ]);

    /**
     * Continue button on the LocationCheckDialog (in-radius branch
     * only). Drives `performCheckout` with the snapshot of task ids
     * captured when the dialog was opened so the payload matches what
     * the user confirmed.
     */
    const handleConfirmCheckout = React.useCallback(async () => {
        if (
            !eventId ||
            !checkoutDialog.withinRadius ||
            checkoutDialog.busy
        ) {
            return;
        }
        setCheckoutDialog((p) => ({ ...p, busy: true }));
        setCheckingOut(true);
        try {
            await performCheckout(eventId, checkoutDialog.pendingTaskIds);
        } finally {
            setCheckingOut(false);
            closeCheckoutDialog();
        }
    }, [
        eventId,
        checkoutDialog.withinRadius,
        checkoutDialog.busy,
        checkoutDialog.pendingTaskIds,
        performCheckout,
        closeCheckoutDialog,
    ]);

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            scrollProps={{ showsVerticalScrollIndicator: false }}
            containerProps={{
                style: {
                    paddingTop: 14,
                    paddingHorizontal: "6%",
                    paddingBottom: "10%",
                },
            }}
        >
            {/* Header */}
            <View row centerV style={{ paddingVertical: 6 }}>
                <BackButton
                    color="#fff"
                    style={{
                        width: moderateScale(44),
                        height: moderateScale(44),
                        marginBottom: 0,
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                />
                <View flex center>
                    <Text semibold regularSize numberOfLines={1} style={{ color: "#fff" }}>
                        {headerTitle}
                    </Text>
                </View>
                <View width={moderateScale(44)} />
            </View>

            {/* Timer + Progress card */}
            <View
                marginT-18
                padding-16
                style={{
                    backgroundColor: "#1E1E1E",
                    borderRadius: moderateScale(18),
                }}
            >
                <Text extraSmall semibold style={{ color: "#818898", textAlign: "center" }}>
                    CURRENT SESSION TIME
                </Text>

                <View row centerH marginT-14 style={{ gap: moderateScale(10) }}>
                    {[
                        { value: hours, label: "Hours" },
                        { value: minutes, label: "Minutes" },
                        { value: seconds, label: "Seconds" },
                    ].map((b) => (
                        <View key={b.label} center style={{ width: moderateScale(78) }}>
                            <View
                                center
                                style={{
                                    width: "100%",
                                    paddingVertical: moderateScale(10),
                                    backgroundColor: "#0B0B0B",
                                    borderRadius: moderateScale(14),
                                }}
                            >
                                <Text bold large24 style={{ color: theme.color.primary }}>
                                    {b.value}
                                </Text>
                            </View>
                            <Text extraSmall regular marginT-8 style={{ color: "#818898" }}>
                                {b.label}
                            </Text>
                        </View>
                    ))}
                </View>

                <View row spread centerV marginT-18>
                    <Text semibold small style={{ color: "#fff" }}>
                        Job Checklist
                    </Text>
                    <Text extraSmall regular style={{ color: theme.color.primary }}>
                        {completedCount} of {totalCount} Completed
                    </Text>
                </View>

                <View
                    marginT-10
                    style={{
                        height: moderateScale(10),
                        borderRadius: moderateScale(20),
                        backgroundColor: "#2A2A2A",
                        overflow: "hidden",
                    }}
                >
                    <View
                        style={{
                            height: "100%",
                            width: `${Math.round(progress * 100)}%`,
                            backgroundColor: theme.color.primary,
                            borderRadius: moderateScale(20),
                        }}
                    />
                </View>
            </View>

            {/* Required tasks */}
            <Text marginT-24 bold large20 style={{ color: "#fff" }}>
                Required Tasks
            </Text>

            <View marginT-12 style={{ gap: moderateScale(12) }}>
                {totalCount === 0 ? (
                    <View
                        center
                        padding-16
                        style={{
                            backgroundColor: "#1E1E1E",
                            borderRadius: moderateScale(14),
                        }}
                    >
                        <Text small regular style={{ color: "#818898", textAlign: "center" }}>
                            No tasks were specified for this job.
                        </Text>
                    </View>
                ) : (
                    taskItems.map((task, idx) => {
                        const done = !!doneByIndex[idx];
                        return (
                            <TouchableOpacity
                                key={task.id ?? `${idx}-${task.name}`}
                                row
                                centerV
                                activeOpacity={0.85}
                                onPress={() => toggleTask(idx)}
                                style={{
                                    backgroundColor: "#1E1E1E",
                                    borderRadius: moderateScale(14),
                                    paddingVertical: moderateScale(14),
                                    paddingHorizontal: moderateScale(14),
                                }}
                            >
                                <View
                                    center
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22),
                                        borderRadius: moderateScale(6),
                                        borderWidth: 2,
                                        borderColor: done ? theme.color.primary : "#6C6C6C",
                                        backgroundColor: done ? theme.color.primary : "transparent",
                                    }}
                                >
                                    {done ? (
                                        <Icon
                                            vector="Ionicons"
                                            name="checkmark"
                                            size={14}
                                            color="#fff"
                                        />
                                    ) : null}
                                </View>

                                <Text
                                    flex
                                    marginL-12
                                    regular
                                    style={{
                                        color: done ? "#818898" : "#fff",
                                        textDecorationLine: done ? "line-through" : "none",
                                    }}
                                >
                                    {task.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                )}
            </View>

            {/* Evidence & Forms */}
            <Text marginT-24 bold large20 style={{ color: "#fff" }}>
                Evidence & Forms
            </Text>

            <View row marginT-12 style={{ gap: moderateScale(12) }}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={photoPickerBusy}
                    style={{
                        flex: 1,
                        height: moderateScale(110),
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(16),
                        borderStyle: "dashed",
                        borderWidth: 1.5,
                        borderColor: "#2A2A2A",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: photoPickerBusy ? 0.6 : 1,
                    }}
                    onPress={handlePickPhoto}
                >
                    <Icon vector="Ionicons" name="camera-outline" size={22} color={theme.color.primary} />
                    <Text marginT-8 semibold extraSmall style={{ color: "#818898" }}>
                        UPLOAD PHOTO
                    </Text>
                </TouchableOpacity>

                {/*
                 * Evidence photo placeholder. Empty state has a blue dashed
                 * outline matching the upload tile's primary color; once a
                 * photo is picked it renders the thumbnail with a circular
                 * close button (same pattern used for document thumbnails
                 * in `verifyProvider.tsx`).
                 */}
                <View
                    style={{
                        flex: 1,
                        height: moderateScale(110),
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(16),
                        borderWidth: 1.5,
                        borderStyle: evidencePhoto ? "solid" : "dashed",
                        borderColor: theme.color.primary,
                        overflow: "hidden",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {evidencePhoto ? (
                        <>
                            <Image
                                source={{ uri: evidencePhoto.uri }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={removeEvidencePhoto}
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                style={{
                                    position: "absolute",
                                    top: moderateScale(6),
                                    right: moderateScale(6),
                                    width: moderateScale(28),
                                    height: moderateScale(28),
                                    borderRadius: moderateScale(14),
                                    backgroundColor: "rgba(0,0,0,0.65)",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Icon
                                    vector="Feather"
                                    name="x"
                                    size={moderateScale(18)}
                                    color="#fff"
                                />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Icon
                                vector="Ionicons"
                                name="image-outline"
                                size={22}
                                color={theme.color.primary}
                            />
                            <Text
                                marginT-8
                                semibold
                                extraSmall
                                style={{ color: "#818898", textAlign: "center" }}
                            >
                                PHOTO PREVIEW
                            </Text>
                        </>
                    )}
                </View>
            </View>

            <View row marginT-14 style={{ gap: moderateScale(12) }}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        backgroundColor: "#1E1E1E",
                        borderRadius: moderateScale(14),
                        paddingVertical: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onPress={() =>
                        Toaster({
                            visible: true,
                            preset: ToastPresets.GENERAL,
                            message: "There should be more than 1 members to start a chat.",
                        })
                    }
                >
                    <Icon vector="Ionicons" name="chatbubble-ellipses-outline" size={18} color="#fff" />
                    <Text semibold style={{ color: "#fff" }}>
                        Group Chat
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: moderateScale(14),
                        paddingVertical: 12,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                    }}
                    onPress={() =>
                        Toaster({
                            visible: true,
                            preset: ToastPresets.GENERAL,
                            message: "Coming Soon",
                        })
                    }
                >
                    <Icon vector="Ionicons" name="document-text-outline" size={18} color="#000" />
                    <Text semibold style={{ color: "#000" }}>
                        Recap Forms
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Check-Out */}
            <View marginT-20>
                <CustomButton
                    label={checkingOut ? "Checking out…" : "Check-Out"}
                    onPress={handleCheckOutPress}
                    disabled={checkingOut}
                    backgroundColor="#EF4444"
                    iconSource={require("@/assets/images/logout.png")}
                    iconStyle={{
                        width: moderateScale(18),
                        height: moderateScale(18),
                        tintColor: "#fff",
                        marginRight: moderateScale(8),
                    } as any}
                />
            </View>

            <LocationCheckDialog
                visible={checkoutDialog.visible}
                onClose={closeCheckoutDialog}
                onContinue={handleConfirmCheckout}
                eventCoords={
                    event &&
                    typeof event.latitude === "number" &&
                    typeof event.longitude === "number" &&
                    Number.isFinite(event.latitude) &&
                    Number.isFinite(event.longitude)
                        ? {
                              latitude: event.latitude,
                              longitude: event.longitude,
                          }
                        : null
                }
                userCoords={checkoutDialog.userCoords}
                withinRadius={checkoutDialog.withinRadius}
                distance={checkoutDialog.distance}
                radiusMeters={CHECKIN_RADIUS_METERS}
                action="check-out"
                busy={checkoutDialog.busy}
            />
        </Container>
    );
};

export default StartJob;
