import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { Alert, Dimensions, Platform } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

//Google Maps API Key
export const GOOGLE_MAPS_API_KEY = "AIzaSyBIT0p8x0Wygh3z1_yXyGjLG9KnUkhEFL4";

/** Shown on provider home when the logged-in user has no profile image URL from the API. */
export const CONTRACTOR_PROFILE_AVATAR_URL =
  "https://thumbs.dreamstime.com/b/faceless-businessman-avatar-man-suit-blue-tie-human-profile-userpic-face-features-web-picture-gentlemen-85824471.jpg";

export const CheckIfValid = (
  index: number,
  isValid: boolean,
  state: boolean[],
  setState: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
  const copy = [...state];
  copy[index] = isValid;
  setState(copy);
};

export const PickImageFromLibrary = async (
  type = "any",
  setImage: React.Dispatch<React.SetStateAction<IMAGE_TYPE | null>>
) => {
  if (type === "any") {
    Alert.alert("Select Option", "Please select an option", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Video",
        onPress: async () => {
          let data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "videos",
            quality: 0.7,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
            allowsEditing: true,
          });

          let images = data?.assets?.[0];

          let image = {
            uri: images?.uri,
            name: images?.fileName
              ? images.fileName
              : images?.uri?.split("/")[images?.uri?.split("/").length - 1],
            type: images?.mimeType,
            size: images?.fileSize,
          };
          setImage(image as IMAGE_TYPE);
        },
      },
      {
        text: "Photo",
        onPress: async () => {
          let images = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.7,
            allowsMultipleSelection: false,
            allowsEditing: true,
          });

          let img = images.assets?.[0];

          let image = {
            uri: img?.uri,
            name: img?.fileName
              ? img.fileName
              : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
            type: img?.mimeType,
            size: img?.fileSize,
          };
          setImage(image as IMAGE_TYPE);
        },
      },
    ]);
  } else {
    let images = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsMultipleSelection: false,
      mediaTypes: type as ImagePicker.MediaType,
      allowsEditing: true,
    });

    let img = images.assets?.[0];

    let image = {
      uri: img?.uri,
      name: img?.fileName
        ? img.fileName
        : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
      type: img?.mimeType,
      size: img?.fileSize,
    };
    setImage(image as IMAGE_TYPE);
  }
};

export interface IMAGE_TYPE {
  uri: string;
  name: string;
  type: string | undefined;
  size: number | undefined;
}

export const PickMultipleImagesFromLibrary = async (
  type: "any" | "images" | "videos" | undefined = "any",
  setImage: React.Dispatch<React.SetStateAction<IMAGE_TYPE[]>>
) => {
  if (type === "any") {
    Alert.alert("Select Option", "Please select an option", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Video",
        onPress: async () => {
          let images = await ImagePicker.launchImageLibraryAsync({
            quality: 0.7,
            allowsMultipleSelection: true,
            allowsEditing: true,
            selectionLimit: 5,
            mediaTypes: "videos",
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
          });

          let imgs = images.assets?.map((img) => {
            return {
              uri: img?.uri,
              name: img?.fileName
                ? img.fileName
                : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
              type: img?.mimeType,
              size: img?.fileSize,
            };
          });
          setImage(imgs as IMAGE_TYPE[]);
        },
      },
      {
        text: "Photo",
        onPress: async () => {
          let images = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.7,
            allowsMultipleSelection: false,
            allowsEditing: true,
          });

          let imgs = images.assets?.map((img) => {
            return {
              uri: img?.uri,
              name: img?.fileName
                ? img.fileName
                : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
              type: img?.mimeType,
              size: img?.fileSize,
            };
          });
          setImage(imgs as IMAGE_TYPE[]);
        },
      },
    ]);
  } else {
    let images = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type as ImagePicker.MediaType,
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      allowsEditing: true,
    });
    let imgs = images.assets?.map((img) => {
      return {
        uri: img?.uri,
        name: img?.fileName
          ? img.fileName
          : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
        type: img?.mimeType,
        size: img?.fileSize,
      };
    });
    setImage(imgs as IMAGE_TYPE[]);
  }
};

export const PickImageFromCamera = async (
  type = "any",
  setImage: React.Dispatch<React.SetStateAction<null | object>>
) => {
  if (type === "any") {
    Alert.alert(
      "Select Option",
      "Please select an option",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Video",
          onPress: async () => {
            let images = await ImagePicker.launchCameraAsync({
              mediaTypes: "videos",
              videoQuality:
                ImagePicker.UIImagePickerControllerQualityType.Medium,
              allowsEditing: true,
            });

            let img = images.assets?.[0];

            let image = {
              uri: img?.uri,
              name: img?.fileName
                ? img.fileName
                : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
              type: img?.mimeType,
              size: img?.fileSize,
            };
            setImage(image);
          },
        },
        {
          text: "Photo",
          onPress: async () => {
            let images = await ImagePicker.launchCameraAsync({
              mediaTypes: "images",
              quality: 0.7,
              allowsEditing: true,
            });
            let img = images.assets?.[0];

            let image = {
              uri: img?.uri,
              name: img?.fileName
                ? img.fileName
                : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
              type: img?.mimeType,
              size: img?.fileSize,
            };
            setImage(image);
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  } else {
    let images = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      mediaTypes: type as ImagePicker.MediaType,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      allowsEditing: true,
    });

    let img = images.assets?.[0];

    let image = {
      uri: img?.uri,
      name: img?.fileName
        ? img.fileName
        : img?.uri?.split("/")[img?.uri?.split("/").length - 1],
      type: img?.mimeType,
      size: img?.fileSize,
    };
    setImage(image);
  }
};

export const AskToPickImage = (
  type = "any",
  setImage: React.Dispatch<React.SetStateAction<null | object>>
) => {
  Alert.alert(
    "Select an option",
    "Please selection one to continue",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Camera",
        onPress: () => PickImageFromCamera(type, setImage),
      },
      {
        text: "Library",
        onPress: () => PickImageFromLibrary(type, setImage),
      },
    ],
    {
      cancelable: true,
    }
  );
};

export function mmss(seconds: number) {
  const minutes = Math.floor(seconds / 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const sec = Math.floor(seconds % 60).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return { minutes, sec };
}

export function dhm(ms: number) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000)).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000)).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000)).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return { days, hours, minutes, sec };
}

export const DummyProfilePic =
  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

export const getDeviceInfo = () => {
  const platformMap: Record<string, "IOS" | "ANDROID" | "WEB"> = {
    ios: "IOS",
    android: "ANDROID",
    web: "WEB",
  };

  return {
    platform: platformMap[Platform.OS] || "WEB",
    deviceId: "12312471281297321",
  };
};

export const getDeviceName = () => {
  return Device?.deviceName || "Unknown Device";
};

export const convertDataToFormData = (data: any) => {
  let formData = new FormData();
  Object.keys(data).forEach((v) => formData.append(v, data[v]));
  return formData;
};

export const Initials = (name: string) => {
  if (name.split(" ").length > 1) return name[0] + name.split(" ")[1][0];
  else return name[0];
};
