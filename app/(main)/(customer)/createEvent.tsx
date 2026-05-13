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
import { AppDispatch } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Text, ToastPresets, View } from "react-native-ui-lib";

/** Fixed event address until location picking is enabled */
const EVENT_ADDRESS = "7th street, San Francisco, CA";

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
    eventDate: "",
    startTime: "",
    endTime: "",
    additionalDetails: "",
  });

  const [successVisible, setSuccessVisible] = React.useState(false);

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
          address: EVENT_ADDRESS,
          event_date: form.eventDate.trim(),
          event_start_time: form.startTime.trim(),
          event_end_time: form.endTime.trim(),
          event_description: form.additionalDetails.trim(),
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

        <TouchableOpacity
          activeOpacity={1}
          disabled
          //onPress={() => router.push("/chooseLocation")}
        >
          <View pointerEvents="none">
            <Input
              disabled
              marginT-16
              label="Event Location:"
              placeholder="Enter Location"
              value={EVENT_ADDRESS}
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

        {/* Documents */}
        <Text marginT-18 semibold small style={{ color: "#fff" }}>
          Documents
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            marginTop: 10,
            backgroundColor: "#1E1E1E",
            borderRadius: moderateScale(12),
            height: verticalScale(45),
            paddingHorizontal: moderateScale(16),
            flexDirection: "row",
            alignItems: "center",
          }}
          onPress={() => {
            Toaster({
              visible: true,
              message: "Document attachment is coming soon.",
              preset: ToastPresets.SUCCESS,
            });
          }}
        >
          <Text small regular style={{ color: "#818898", flex: 1 }}>
            Attach document
          </Text>
          <Icon vector="Ionicons" name="document-text-outline" size={20} color={theme.color.primary} />
        </TouchableOpacity>

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

