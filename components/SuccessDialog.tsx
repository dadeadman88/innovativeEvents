import CustomButton from "@/components/Button";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/constants";
import * as React from "react";
import { moderateScale } from "react-native-size-matters";
import { Dialog, Image, Text, View } from "react-native-ui-lib";

type SuccessDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  description?: string;
  buttonLabel?: string;
  onButtonPress: () => void;
  /**
   * When true, uses the default success check icon unless imageSource is provided.
   */
  success?: boolean;
  imageSource?: any;
  width?: number;
  height?: number;
};

const SuccessDialog = ({
  visible,
  onDismiss,
  title,
  description,
  buttonLabel = "Continue",
  onButtonPress,
  success = true,
  imageSource,
  width = SCREEN_WIDTH * 0.85,
  height = SCREEN_HEIGHT * 0.5,
}: SuccessDialogProps) => {
  const resolvedImage =
    imageSource ??
    (success ? require("@/assets/images/check.png") : require("@/assets/images/check.png"));

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
        <Image
          source={resolvedImage}
          width={moderateScale(120)}
          height={moderateScale(120)}
          resizeMode="contain"
        />
        <Text center black bold large20 marginT-30>
          {title}
        </Text>
        {description ? (
          <Text gray medium small center marginT-12>
            {description}
          </Text>
        ) : null}
        <CustomButton
          marginT-30
          label={buttonLabel}
          onPress={onButtonPress}
          style={{ width: "85%" }}
        />
      </View>
    </Dialog>
  );
};

export default SuccessDialog;

