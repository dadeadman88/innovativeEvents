import BackButton from "@/components/BackButton";
import Container from "@/components/Container";
import * as React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native-ui-lib";
import { moderateScale } from "react-native-size-matters";

const AboutApp = () => {
    const { title } = useLocalSearchParams<{ title?: string }>();
    const resolvedTitle = typeof title === "string" && title.length > 0 ? title : "About App";

    return (
        <Container
            appBar={false}
            contentBackgroundColor="#000"
            containerProps={{ style: { paddingHorizontal: "6%", paddingBottom: "8%" } }}
        >
            <View
                row
                centerV
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    alignItems: "center",
                }}
            >
                <BackButton style={{ marginBottom: 0 }} />
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text semibold regularSize style={{ color: "#fff" }}>
                        {resolvedTitle}
                    </Text>
                </View>
                <View style={{ width: moderateScale(50) }} />
            </View>

            <View marginT-20>
                <Text regular small style={{ color: "#818898" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                </Text>

                <Text regular small marginT-20 style={{ color: "#818898" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                </Text>

                <Text regular small marginT-20 style={{ color: "#818898" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                </Text>

                <Text regular small marginT-20 style={{ color: "#818898" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien, consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
                </Text>

                <View marginB-40 />
            </View>
        </Container>
    );
};

export default AboutApp;
