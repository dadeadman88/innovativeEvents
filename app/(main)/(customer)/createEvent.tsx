import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import Input from "@/components/Input";
import SuccessDialog from "@/components/SuccessDialog";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Text, View } from "react-native-ui-lib";

const CreateEvent = () => {
  const [form, setForm] = React.useState({
    eventName: "",
    phone: "",
    email: "",
    staffMembersRequested: "",
    service: "",
    location: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    additionalDetails: "",
  });

  const [showUploadHint] = React.useState(true);
  const [successVisible, setSuccessVisible] = React.useState(false);

  const inputFieldStyle = {
    backgroundColor: "#1E1E1E",
    height: verticalScale(45),
    borderRadius: moderateScale(12),
  };

  const inputLabelStyle = {
    color: "#fff",
  };

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

      {/* Upload Card */}
      <View
        marginT-20
        padding-20
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: moderateScale(16),
          alignItems: "center",
          justifyContent: "center",
          minHeight: moderateScale(130),
        }}
      >
        <TouchableOpacity
          style={{
            width: moderateScale(44),
            height: moderateScale(44),
            borderRadius: moderateScale(22),
            backgroundColor: theme.color.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <Icon vector="Ionicons" name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <Text small regular style={{ color: "#818898", textAlign: "center" }}>
          Upload a picture/poster/banner*
        </Text>
        {showUploadHint && (
          <Text
            extraSmall
            regular
            style={{ color: "#818898", textAlign: "center", marginTop: 6 }}
          >
            724x340 px and no more than 2MB{"\n"}recommended
          </Text>
        )}
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

        <Input
          marginT-16
          label="Select Service:"
          placeholder="Select"
          value={form.service}
          onChangeText={(t) => setForm((p) => ({ ...p, service: t }))}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <Icon vector="Ionicons" name="chevron-down" size={18} color="#818898" />
          }
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/chooseLocation")}
        >
          <View pointerEvents="none">
            <Input
              marginT-16
              label="Event Location:"
              placeholder="Enter Location"
              value={form.location}
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

        <Input
          marginT-16
          label="Event Date:"
          placeholder="mm/dd/yyyy"
          value={form.eventDate}
          onChangeText={(t) => setForm((p) => ({ ...p, eventDate: t }))}
          labelProps={{ style: inputLabelStyle } as any}
          fieldStyle={inputFieldStyle}
          placeholderTextColor="#818898"
          style={{ color: "#fff" }}
          trailingAccessory={
            <Icon vector="Ionicons" name="calendar-clear-outline" size={18} color={theme.color.primary} />
          }
        />

        <View row marginT-16 gap-12>
          <View flex>
            <Input
              label="Start Time:"
              placeholder="hh:mm"
              value={form.startTime}
              onChangeText={(t) => setForm((p) => ({ ...p, startTime: t }))}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
            />
          </View>
          <View flex>
            <Input
              label="End Time:"
              placeholder="hh:mm"
              value={form.endTime}
              onChangeText={(t) => setForm((p) => ({ ...p, endTime: t }))}
              labelProps={{ style: inputLabelStyle } as any}
              fieldStyle={inputFieldStyle}
              placeholderTextColor="#818898"
              style={{ color: "#fff" }}
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
          onPress={() => {}}
        >
          <Text small regular style={{ color: "#818898", flex: 1 }}>
            attach documents
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

      <CustomButton
        marginT-24
        label="Create Event"
        onPress={() => setSuccessVisible(true)}
      />

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

