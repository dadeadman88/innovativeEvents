import BackButton from "@/components/BackButton";
import CustomButton from "@/components/Button";
import Container from "@/components/Container";
import Icon from "@/components/Icon";
import { AuthActions } from "@/redux/actions/AuthActions";
import { useToast } from "@/redux/actions/hooks/useOthers";
import { AppDispatch } from "@/redux/store";
import { theme } from "@/utils/designSystem";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import * as React from "react";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { Text, ToastPresets, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";

const docs = [
  { key: "drivers_license", label: "Drivers license" },
  { key: "passport", label: "Passport" },
  { key: "sampling_licensure", label: "Sampling licensure" },
  { key: "social_security_card", label: "Social Security card" },
] as const;

type DocKey = (typeof docs)[number]["key"];

const DOC_KEY_ORDER = new Map<DocKey, number>(docs.map((d, i) => [d.key, i]));

function sortPickedImagesByDocOrder(images: PickedImage[]): PickedImage[] {
  return [...images].sort(
    (a, b) => (DOC_KEY_ORDER.get(a.docKey) ?? 0) - (DOC_KEY_ORDER.get(b.docKey) ?? 0)
  );
}

function labelForDocKey(key: DocKey): string {
  return docs.find((d) => d.key === key)?.label ?? key;
}

type PickedImage = {
  uri: string;
  docKey: DocKey;
  mimeType?: string | null;
  fileName?: string | null;
};

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const VerifyProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { Toaster } = useToast();
  const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openPickerForDoc = useCallback(async (docKey: DocKey) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: false,
      // 0 = strongest compression / smallest file (per expo-image-picker)
      quality: 0,
      exif: false,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    const asset = result.assets[0];
    setPickedImages((prev) =>
      sortPickedImagesByDocOrder([
        ...prev.filter((p) => p.docKey !== docKey),
        {
          uri: asset.uri,
          docKey,
          mimeType: asset.mimeType,
          fileName: asset.fileName,
        },
      ])
    );
  }, []);

  const removePickedImage = useCallback((docKey: DocKey) => {
    setPickedImages((prev) => prev.filter((p) => p.docKey !== docKey));
  }, []);

  const params = useLocalSearchParams<{
    role?: "provider";
    email?: string | string[];
    code?: string | string[];
    firstName?: string | string[];
    lastName?: string | string[];
    phone?: string | string[];
    address?: string | string[];
    password?: string | string[];
  }>();

  const email = normalizeParam(params.email);
  const firstName = normalizeParam(params.firstName)?.trim() ?? "";
  const lastName = normalizeParam(params.lastName)?.trim() ?? "";
  const password = normalizeParam(params.password) ?? "";
  const phone = normalizeParam(params.phone)?.trim() ?? "";
  const address = normalizeParam(params.address)?.trim() ?? "";

  const handleContinue = async () => {
    if (pickedImages.length === 0) {
      Toaster({
        visible: true,
        preset: ToastPresets.FAILURE,
        message:
          "Please upload at least one document (driver's license, passport, sampling licensure, or Social Security card).",
      });
      return;
    }

    if (!firstName || !lastName || !email?.trim() || !password) {
      Toaster({
        visible: true,
        preset: ToastPresets.FAILURE,
        message: "Missing account details. Please go back and complete signup.",
      });
      return;
    }

    // TODO: restore when API accepts multipart contractor documents — build `files` and pass to ContractorRegister.
    // const latestByDoc = new Map<DocKey, PickedImage>();
    // for (const img of pickedImages) {
    //   latestByDoc.set(img.docKey, img);
    // }
    // const files = Array.from(latestByDoc.values()).map((pic) => ({
    //   field: pic.docKey,
    //   uri: pic.uri,
    //   mimeType: pic.mimeType,
    //   fileName: pic.fileName,
    // }));

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        AuthActions.ContractorRegister({
          first_name: firstName,
          last_name: lastName,
          email: email.trim(),
          password,
          mobile_number: phone,
          address,
        })
      ).unwrap();

      Toaster({
        visible: true,
        preset: ToastPresets.SUCCESS,
        message: "Registration successful, your account is waiting approval",
      });
      router.replace("/login");
    } catch (err) {
      if (typeof err === "string") {
        Toaster({ visible: true, preset: ToastPresets.FAILURE, message: err });
      }
      // Other errors are surfaced by AxiosInterceptor
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <BackButton />

      {/* Heading */}
      <View marginB-24>
        <Text white bold large24 style={{ color: "#fff" }}>
          Required Documentation
        </Text>
        <Text
          marginT-12
          small
          regular
          style={{ color: "#818898", lineHeight: moderateScale(22) }}
        >
          Please upload the necessary documents to verify your contractor profile and
          sign pending digital agreements.
        </Text>
      </View>

      {/* Documents Grid */}
      <View
        row
        gap-12
        style={{ marginBottom: moderateScale(26), flexWrap: "wrap" }}
      >
        {docs.map((doc) => {
          const hasPickedForDoc = pickedImages.some((p) => p.docKey === doc.key);
          return (
          <TouchableOpacity
            key={doc.key}
            activeOpacity={0.8}
            onPress={() => openPickerForDoc(doc.key)}
            style={{
              width: "47.5%",
              borderRadius: moderateScale(18),
              paddingVertical: moderateScale(18),
              paddingHorizontal: moderateScale(10),
              backgroundColor: "#151918",
              borderWidth: hasPickedForDoc ? 2 : 1.5,
              borderStyle: hasPickedForDoc ? "solid" : "dashed",
              borderColor: hasPickedForDoc ? theme.color.primary : "#3A3A3A",
              alignItems: "center",
              justifyContent: "center",
              minHeight: moderateScale(108),
            }}
          >
            <Icon
              vector="Feather"
              name="upload"
              size={moderateScale(28)}
              color={theme.color.primary}
            />
            <Text
              marginT-12
              semibold
              small
              style={{ color: "#fff", textAlign: "center" }}
            >
              {doc.label}
            </Text>
          </TouchableOpacity>
          );
        })}
      </View>

      {pickedImages.length > 0 && (
        <FlatList
          data={pickedImages}
          keyExtractor={(item) => item.docKey}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickedListContent}
          style={styles.pickedList}
          renderItem={({ item }) => (
            <View style={styles.thumbWrap}>
              <Image source={{ uri: item.uri }} style={styles.thumbImage} />
              <View style={styles.thumbLabelOverlay}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.thumbLabelText}
                >
                  {labelForDocKey(item.docKey)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePickedImage(item.docKey)}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Icon vector="Feather" name="x" size={moderateScale(22)} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Sign Up Button */}
      <View marginT-10>
        <CustomButton label="Sign Up" onPress={handleContinue} disabled={isSubmitting} />
      </View>
    </Container>
  );
};

const thumbSize = moderateScale(176);

const styles = StyleSheet.create({
  pickedList: {
    marginBottom: moderateScale(12),
    maxHeight: thumbSize + moderateScale(10),
  },
  pickedListContent: {
    gap: moderateScale(14),
    paddingVertical: moderateScale(4),
  },
  thumbWrap: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  thumbLabelOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(6),
  },
  thumbLabelText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
  removeBtn: {
    position: "absolute",
    top: moderateScale(6),
    right: moderateScale(6),
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VerifyProvider;
