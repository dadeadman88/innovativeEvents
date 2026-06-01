import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import DTPicker from "@/components/DTPicker";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import PickerC from "@/components/PickerC";
import SuccessDialog from "@/components/SuccessDialog";
import { EventActions } from "@/redux/actions/EventActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { clearPickedLocation } from "@/redux/slices/LocationSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Image, Text, ToastPresets, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

/**
 * Optional document attachment picked from the user's photo library.
 * Mirrors the shape used by `StartJob.tsx`'s `EvidencePhoto`. Held in
 * component state only — not part of the form payload because the
 * `event/add` API doesn't accept an attachment yet.
 */
type AttachedDocument = {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
};

const SERVICE_OPTIONS = [
  { label: "Event staffing & brand ambassadors", value: "Event staffing & brand ambassadors" },
  { label: "Registration & check-in", value: "Registration & check-in" },
  { label: "Crowd management & ushers", value: "Crowd management & ushers" },
  { label: "VIP hosting & guest services", value: "VIP hosting & guest services" },
  { label: "Stage hands & load-in / load-out", value: "Stage hands & load-in / load-out" },
  { label: "Audio / visual support (basic)", value: "Audio / visual support (basic)" },
  { label: "Lighting & rigging assistance", value: "Lighting & rigging assistance" },
  { label: "Product sampling & demonstrations", value: "Product sampling & demonstrations" },
  { label: "Retail activations & pop-ups", value: "Retail activations & pop-ups" },
  { label: "Trade show booth support", value: "Trade show booth support" },
  { label: "Experiential marketing roadshow", value: "Experiential marketing roadshow" },
  { label: "Street team distribution", value: "Street team distribution" },
  { label: "Photography / content capture support", value: "Photography / content capture support" },
  { label: "Runner & logistics support", value: "Runner & logistics support" },
  { label: "Merchandise sales & cash handling", value: "Merchandise sales & cash handling" },
  { label: "Hospitality & catering support", value: "Hospitality & catering support" },
  { label: "Security liaison (non-armed, event staff)", value: "Security liaison (non-armed, event staff)" },
  { label: "Other / custom scope", value: "Other / custom scope" },
] as const;

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Backend: e.g. 2026-03-28 */
function formatYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseYYYYMMDD(value: string): Date | undefined {
  const s = value.trim();
  if (!s) return undefined;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (!m) return undefined;
  const yyyy = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
    return undefined;
  }
  return d;
}

/** Backend: e.g. 23:47:50 */
function formatHHMMSS(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function parseHHMMSS(
  value: string
): { hours: number; minutes: number; seconds: number } | undefined {
  const s = value.trim();
  if (!s) return undefined;
  const m3 = /^(\d{1,2}):(\d{2}):(\d{2})$/.exec(s);
  if (m3) {
    const hh = Number(m3[1]);
    const mm = Number(m3[2]);
    const ss = Number(m3[3]);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) return undefined;
    return { hours: hh, minutes: mm, seconds: ss };
  }
  const m2 = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m2) return undefined;
  const hh = Number(m2[1]);
  const mm = Number(m2[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return undefined;
  return { hours: hh, minutes: mm, seconds: 0 };
}

function timePartsToSeconds(t: { hours: number; minutes: number; seconds: number }) {
  return t.hours * 3600 + t.minutes * 60 + t.seconds;
}

const CreateEvent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();

  const [form, setForm] = React.useState({
    eventName: "",
    phone: "",
    email: "",
    staffMembersRequested: "",
    service: "",
    /**
     * Picked event address. Filled by the `chooseLocation` screen via
     * the Redux `LocationSlice`; not user-typed. Required.
     */
    address: "",
    /** GPS coordinates of the picked address. Only set when the user
     *  picks via the map. Omitted from the payload when undefined. */
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    eventDate: "",
    startTime: "",
    endTime: "",
    additionalDetails: "",
    /**
     * Free-form list of task descriptions for the event. UI lets the user
     * add/remove rows (1–10). One empty row is kept by default so the field
     * is immediately usable.
     */
    tasks: [""] as string[],
  });

  /**
   * Pull the freshest location pick from the Redux `LocationSlice` and
   * apply it to the form. We track the slice's `pickToken` so we only
   * re-apply the address when the user actually committed a new pick
   * (re-rendering or re-focusing the screen with the same picked
   * address won't trigger work).
   *
   * Once applied, we clear the slice so a follow-up screen that uses
   * `chooseLocation` doesn't accidentally reuse this pick.
   */
  const picked = useSelector((s: RootState) => s.location.picked);
  const pickToken = useSelector((s: RootState) => s.location.pickToken);
  const lastAppliedToken = React.useRef<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      if (picked && pickToken !== lastAppliedToken.current) {
        lastAppliedToken.current = pickToken;
        setForm((p) => ({
          ...p,
          address: picked.address,
          latitude: picked.latitude,
          longitude: picked.longitude,
        }));
        dispatch(clearPickedLocation());
      }
    }, [picked, pickToken, dispatch])
  );

  const MAX_TASKS = 10;

  const updateTaskAt = React.useCallback((index: number, value: string) => {
    setForm((p) => ({
      ...p,
      tasks: p.tasks.map((t, i) => (i === index ? value : t)),
    }));
  }, []);

  const addTask = React.useCallback(() => {
    setForm((p) =>
      p.tasks.length >= MAX_TASKS ? p : { ...p, tasks: [...p.tasks, ""] }
    );
  }, []);

  const removeTaskAt = React.useCallback((index: number) => {
    setForm((p) => {
      // Keep at least one row so the section never collapses entirely.
      if (p.tasks.length <= 1) return p;
      return {
        ...p,
        tasks: p.tasks.filter((_, i) => i !== index),
      };
    });
  }, []);

  const [successVisible, setSuccessVisible] = React.useState(false);

  /**
   * Optional attachment for the event. Tapping the "Attach document" row
   * opens the image library and stores the picked asset here. Rendered as
   * a thumbnail card below the row with a close button, identical to the
   * pattern in `StartJob.tsx`.
   *
   * The current `event/add` API does NOT accept this field — it's stored
   * only for visual feedback and isn't included in the create-event
   * payload. Wire it up to the API once the backend accepts multipart.
   */
  const [attachedDocument, setAttachedDocument] =
    React.useState<AttachedDocument | null>(null);
  const [documentPickerBusy, setDocumentPickerBusy] = React.useState(false);

  const handleAttachDocument = React.useCallback(async () => {
    if (documentPickerBusy) return;
    setDocumentPickerBusy(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toaster({
          visible: true,
          preset: ToastPresets.FAILURE,
          message: "Photo library access is required to attach a document.",
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
      setAttachedDocument({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
    } finally {
      setDocumentPickerBusy(false);
    }
  }, [documentPickerBusy, Toaster]);

  const removeAttachedDocument = React.useCallback(() => {
    setAttachedDocument(null);
  }, []);

  const showValidationToast = React.useCallback(
    (message: string) => {
      Toaster({
        visible: true,
        message,
        preset: ToastPresets.FAILURE,
      });
    },
    [Toaster]
  );

  const validateAndSubmit = React.useCallback(async () => {
    const name = form.eventName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const staffRaw = form.staffMembersRequested.trim();
    const staffN = Number(staffRaw);
    const emailOk = /^\S+@\S+\.\S+$/.test(email);

    if (!name) return showValidationToast("Event name is required");
    if (!phone) return showValidationToast("Phone is required");
    if (!email) return showValidationToast("Email is required");
    if (!emailOk) return showValidationToast("Please enter a valid email");
    if (!staffRaw || !Number.isFinite(staffN) || staffN < 1) {
      return showValidationToast("Enter how many staff members you need (at least 1)");
    }
    if (!form.service.trim()) return showValidationToast("Please select a service");
    const trimmedTasks = form.tasks.map((t) => t.trim()).filter(Boolean);
    if (trimmedTasks.length === 0) {
      return showValidationToast("Please add at least one task");
    }
    const address = form.address.trim();
    if (!address) return showValidationToast("Event location is required");
    if (!parseYYYYMMDD(form.eventDate)) return showValidationToast("Event date is required");
    const startT = parseHHMMSS(form.startTime);
    const endT = parseHHMMSS(form.endTime);
    if (!startT) return showValidationToast("Start time is required");
    if (!endT) return showValidationToast("End time is required");
    if (timePartsToSeconds(endT) <= timePartsToSeconds(startT)) {
      return showValidationToast("End time must be after start time");
    }
    if (!form.additionalDetails.trim()) return showValidationToast("Additional details are required");

    try {
      await dispatch(
        EventActions.CreateEvent({
          event_name: name,
          event_phone: phone,
          event_email: email,
          event_staff: String(Math.floor(staffN)),
          event_service: form.service.trim(),
          address,
          latitude: form.latitude,
          longitude: form.longitude,
          event_date: form.eventDate.trim(),
          event_start_time: form.startTime.trim(),
          event_end_time: form.endTime.trim(),
          event_description: form.additionalDetails.trim(),
          tasks: trimmedTasks,
        })
      ).unwrap();
      setSuccessVisible(true);
    } catch {
      // Error toast is shown by AxiosInterceptor
    }
  }, [form, showValidationToast, dispatch]);

  const inputFieldStyle = {
    backgroundColor: "#1E1E1E",
    height: verticalScale(45),
    borderRadius: moderateScale(12),
  };

  const inputLabelStyle = {
    color: "#fff",
  };

  const eventDateValue = React.useMemo(
    () => parseYYYYMMDD(form.eventDate),
    [form.eventDate]
  );

  const timeBaseDate = React.useMemo(
    () => eventDateValue ?? new Date(),
    [eventDateValue]
  );

  const startTimeValue = React.useMemo(() => {
    const t = parseHHMMSS(form.startTime);
    if (!t) return undefined;
    const d = new Date(timeBaseDate);
    d.setHours(t.hours, t.minutes, t.seconds, 0);
    return d;
  }, [form.startTime, timeBaseDate]);

  const endTimeValue = React.useMemo(() => {
    const t = parseHHMMSS(form.endTime);
    if (!t) return undefined;
    const d = new Date(timeBaseDate);
    d.setHours(t.hours, t.minutes, t.seconds, 0);
    return d;
  }, [form.endTime, timeBaseDate]);

  return (
    <Container
      appBar={false}
      contentBackgroundColor="#000"
      scrollProps={{ showsVerticalScrollIndicator: false }}
      containerProps={{
        style: {
          paddingTop: 16,
          paddingHorizontal: "6%",
          paddingBottom: "8%",
        },
      }}
    >
      {/* Header */}
      <View row centerV>
        <BackButton style={{ marginBottom: 0, width: moderateScale(44), height: moderateScale(44) }} />
        <View flex center>
          <Text semibold regularSize style={{ color: "#fff" }}>
            Create Event
          </Text>
        </View>
        <View width={moderateScale(44)} />
      </View>

      {/* Fields */}
      <View marginT-20>
        <Input
          label="Event Name:"
          placeholder="Enter"
          value={form.eventName}
          onChangeText={(t) => setForm((p) => ({ ...p, eventName: t }))}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        <Input
          marginT-16
          label="Phone:"
          placeholder="Number"
          value={form.phone}
          onChangeText={(t) => setForm((p) => ({ ...p, phone: t }))}
          keyboardType="phone-pad"
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        <Input
          marginT-16
          label="Email:"
          placeholder="Enter Email"
          value={form.email}
          onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
          keyboardType="email-address"
          autoCapitalize="none"
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        <Input
          marginT-16
          label="Staff Members Requested:"
          placeholder="12 Members"
          value={form.staffMembersRequested}
          onChangeText={(t) => setForm((p) => ({ ...p, staffMembersRequested: t }))}
          keyboardType="number-pad"
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
        />

        <PickerC
          marginT-16
          label="Select Service:"
          placeholder="Select"
          placeholderTextColor="#818898"
          value={form.service || undefined}
          onChange={(v) => setForm((p) => ({ ...p, service: v == null ? "" : String(v) }))}
          items={SERVICE_OPTIONS.map((s) => ({ label: s.label, value: s.value }))}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          style={{ color: "#fff" }}
        />

        {/* Tasks (1–10 rows). Each row has a remove icon (when more than one
            row exists); the "Add more" pill below appends a new row up to
            MAX_TASKS. */}
        <Text marginT-16 semibold small style={{ color: "#fff" }}>
          Tasks:
        </Text>
        {form.tasks.map((task, idx) => (
          <View key={`task-${idx}`} marginT-10>
            <Input
              placeholder={`Task ${idx + 1}`}
              value={task}
              onChangeText={(t) => updateTaskAt(idx, t)}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
              trailingAccessory={
                form.tasks.length > 1 ? (
                  <TouchableOpacity
                    onPress={() => removeTaskAt(idx)}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Icon
                      vector="Ionicons"
                      name="close-circle"
                      size={20}
                      color="#818898"
                    />
                  </TouchableOpacity>
                ) : undefined
              }
            />
          </View>
        ))}
        {form.tasks.length < MAX_TASKS && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={addTask}
            style={{
              marginTop: 12,
              alignSelf: "flex-start",
              paddingHorizontal: moderateScale(14),
              paddingVertical: moderateScale(8),
              borderRadius: moderateScale(20),
              borderWidth: 1,
              borderColor: theme.color.primary,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon vector="Ionicons" name="add" size={16} color={theme.color.primary} />
            <Text small semibold style={{ color: theme.color.primary, marginLeft: 6 }}>
              Add more
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => router.push("/chooseLocation")}
        >
          <View pointerEvents="none">
            <Input
              marginT-16
              label="Event Location:"
              placeholder="Enter Location"
              value={form.address}
              editable={false}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
              trailingAccessory={
                <Icon vector="Ionicons" name="location" size={18} color={theme.color.primary} />
              }
            />
          </View>
        </TouchableOpacity>

        <DTPicker
          marginT-16
          label="Event Date:"
          placeholder="2026-03-28"
          mode="date"
          editable={true}
          value={eventDateValue}
          themeVariant="dark"
          onChange={(d) => setForm((p) => ({ ...p, eventDate: formatYYYYMMDD(d) }))}
          dateTimeFormatter={(d) => formatYYYYMMDD(d)}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={{
            ...inputFieldStyle,
            borderWidth: 0,
            backgroundColor: "#1E1E1E",
          }}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <Icon vector="Ionicons" name="calendar-clear-outline" size={18} color={theme.color.primary} />
          }
        />

        <View row marginT-16 gap-12>
          <View flex>
            <DTPicker
              label="Start Time:"
              placeholder="23:47:50"
              mode="time"
              editable={true}
              is24Hour
              value={startTimeValue}
              themeVariant="dark"
              onChange={(d) => setForm((p) => ({ ...p, startTime: formatHHMMSS(d) }))}
              dateTimeFormatter={(d) => formatHHMMSS(d)}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={{
                ...inputFieldStyle,
                borderWidth: 0,
                backgroundColor: "#1E1E1E",
              }}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
              trailingAccessory={
                <Icon vector="Ionicons" name="time-outline" size={18} color={theme.color.primary} />
              }
            />
          </View>
          <View flex>
            <DTPicker
              label="End Time:"
              placeholder="23:47:50"
              mode="time"
              editable={true}
              is24Hour
              value={endTimeValue}
              themeVariant="dark"
              onChange={(d) => setForm((p) => ({ ...p, endTime: formatHHMMSS(d) }))}
              dateTimeFormatter={(d) => formatHHMMSS(d)}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={{
                ...inputFieldStyle,
                borderWidth: 0,
                backgroundColor: "#1E1E1E",
              }}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
              trailingAccessory={
                <Icon vector="Ionicons" name="time-outline" size={18} color={theme.color.primary} />
              }
            />
          </View>
        </View>

        {/* Documents (optional). Tapping the row opens the image library;
            once a file is picked we render a thumbnail card below with an
            "x" close button so the user can swap or remove the
            attachment. The asset is not posted to the API yet. */}
        <Text marginT-18 semibold small style={{ color: "#fff" }}>
          Documents
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={documentPickerBusy}
          style={{
            marginTop: 10,
            backgroundColor: "#1E1E1E",
            borderRadius: moderateScale(12),
            height: verticalScale(45),
            paddingHorizontal: moderateScale(16),
            flexDirection: "row",
            alignItems: "center",
            opacity: documentPickerBusy ? 0.6 : 1,
          }}
          onPress={handleAttachDocument}
        >
          <Text small regular style={{ color: "#818898", flex: 1 }}>
            {attachedDocument ? "Replace document" : "Attach document"}
          </Text>
          <Icon vector="Ionicons" name="document-text-outline" size={20} color={theme.color.primary} />
        </TouchableOpacity>

        {attachedDocument ? (
          <View
            marginT-10
            style={{
              height: moderateScale(220),
              backgroundColor: "#1E1E1E",
              borderRadius: moderateScale(16),
              borderWidth: 1.5,
              borderColor: theme.color.primary,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: attachedDocument.uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={removeAttachedDocument}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              style={{
                position: "absolute",
                top: moderateScale(8),
                right: moderateScale(8),
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
          </View>
        ) : null}

        {/* Additional Details */}
        <Text marginT-18 semibold small style={{ color: "#fff" }}>
          Additional Details:
        </Text>
        <Input
          marginT-10
          placeholder="Enter here..."
          value={form.additionalDetails}
          onChangeText={(t) => setForm((p) => ({ ...p, additionalDetails: t }))}
          multiline
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={{
            ...inputFieldStyle,
            height: verticalScale(110),
            paddingTop: moderateScale(12),
            alignItems: "flex-start",
          }}
          placeholderTextColor="#818898"
          style={{ color: "#fff", textAlignVertical: "top" }}
        />
      </View>

      <CustomButton marginT-24 label="Create Event" onPress={validateAndSubmit} />

      <SuccessDialog
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        title="Event created successfully."
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonLabel="See Detail"
        onButtonPress={() => {
          setSuccessVisible(false);
          router.back();
        }}
      />
    </Container>
  );
};

export default CreateEvent;

