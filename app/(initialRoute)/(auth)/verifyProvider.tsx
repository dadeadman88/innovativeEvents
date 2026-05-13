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
import { useCallback, useMemo, useState } from "react";
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

type PickedImage = {
  id: string;
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

  const missingDocLabels = useMemo(() => {
    return docs
      .filter((doc) => !pickedImages.some((p) => p.docKey === doc.key))
      .map((d) => d.label);
  }, [pickedImages]);

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
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setPickedImages((prev) => [
      ...prev,
      {
        id,
        uri: asset.uri,
        docKey,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      },
    ]);
  }, []);

  const removePickedImage = useCallback((id: string) => {
    setPickedImages((prev) => prev.filter((p) => p.id !== id));
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
    if (missingDocLabels.length > 0) {
      Toaster({
        visible: true,
        preset: ToastPresets.FAILURE,
        message: `Please upload all required documents. Missing: ${missingDocLabels.join(", ")}`,
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

    const latestByDoc = new Map<DocKey, PickedImage>();
    for (const img of pickedImages) {
      latestByDoc.set(img.docKey, img);
    }

    const files = docs.map((doc) => {
      const pic = latestByDoc.get(doc.key)!;
      return {
        field: doc.key,
        uri: pic.uri,
        mimeType: pic.mimeType,
        fileName: pic.fileName,
      };
    });

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
          files,
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
        {docs.map((doc) => (
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
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: "#3A3A3A",
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
        ))}
      </View>

      {pickedImages.length > 0 && (
        <FlatList
          data={pickedImages}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pickedListContent}
          style={styles.pickedList}
          renderItem={({ item }) => (
            <View style={styles.thumbWrap}>
              <Image source={{ uri: item.uri }} style={styles.thumbImage} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePickedImage(item.id)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Icon vector="Feather" name="x" size={moderateScale(16)} color="#fff" />
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

const thumbSize = moderateScale(88);

const styles = StyleSheet.create({
  pickedList: {
    marginBottom: moderateScale(12),
    maxHeight: thumbSize + moderateScale(8),
  },
  pickedListContent: {
    gap: moderateScale(10),
    paddingVertical: moderateScale(4),
  },
  thumbWrap: {
    width: thumbSize,
    height: thumbSize,
    borderRadius: moderateScale(12),
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeBtn: {
    position: "absolute",
    top: moderateScale(4),
    right: moderateScale(4),
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VerifyProvider;
