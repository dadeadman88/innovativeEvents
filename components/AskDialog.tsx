import CustomButton from "@/components/Button";
import Icon from "@/components/Icon";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Dialog, Image, Text, View } from "react-native-ui-lib";

type AskDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  yesLabel?: string;
  noLabel?: string;
  /**
   * Optional icon/image shown at the top of the dialog.
   * If `imageSource` is provided, it will be used.
   */
  imageSource?: any;
  icon?: {
    vector: React.ComponentProps<typeof Icon>["vector"];
    name: string;
    color?: string;
    size?: number;
  };
  onYes: () => void;
  onNo: () => void;
  width?: number;
  height?: number;
};

const AskDialog = ({
  visible,
  onDismiss,
  title,
  yesLabel = "Yes",
  noLabel = "No",
  imageSource,
  icon,
  onYes,
  onNo,
  width = SCREEN_WIDTH * 0.9,
  height = SCREEN_HEIGHT * 0.35,
}: AskDialogProps) => {
  return (
    <Dialog
      visible={visible}
      onDismiss={onDismiss}
      width={width}
      height={height}
      center
      containerStyle={{ borderRadius: moderateScale(15) }}
      ignoreBackgroundPress
    >
      <View center flex>
        {imageSource ? (
          <Image
            source={imageSource}
            width={moderateScale(50)}
            height={moderateScale(50)}
            resizeMode="contain"
            style={{ marginVertical: moderateScale(20) }}
          />
        ) : icon ? (
          <Icon
            vector={icon.vector}
            name={icon.name}
            size={moderateScale(40)}
            color={icon.color ?? "#fff"}
            style={{ marginVertical: moderateScale(20) }}
          />
        ) : null}
        <Text center black medium marginT-6 style={{ fontSize: moderateScale(16) }}>
          {title}
        </Text>

        <View row spread marginT-20 style={{ width: "85%" }}>
          <CustomButton
            label={noLabel}
            onPress={() => {
              onNo();
            }}
            backgroundColor="#EF4444"
            color="#fff"
            style={{ flex: 1, marginRight: 8 }}
          />
          <CustomButton
            label={yesLabel}
            onPress={() => {
              onYes();
            }}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </Dialog>
  );
};

export default AskDialog;

