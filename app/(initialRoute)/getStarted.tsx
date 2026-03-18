import CustomButton from "@/components/Button";
import Icon from "@/components/Icon";
import { SCREEN_WIDTH } from "@/utils/constants";
import { theme } from "@/utils/designSystem";
import { router } from "expo-router";
import * as React from "react";
import { useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";

const ONBOARDING_DATA = [
  {
    id: 1,
    title: "Experiential Event Design &\nProduction",
    description:
      "We design and produce innovative events that engage, educate and entertain. From concept to execution, our team brings your vision to life with creativity and precision.",
    image: require("../../assets/images/onboard1.png"),
  },
  {
    id: 2,
    title: "Brand Activation Programs",
    description:
      "We develop strategic brand activation programs that drive awareness, build loyalty and generate buzz. Our activations are designed to resonate with your target audience and leave a lasting impact.",
    image: require("../../assets/images/onboard2.png"),
  },
  {
    id: 3,
    title: "Event Staffing and Management",
    description:
      "Our experienced event professionals ensure seamless execution and flawless delivery. From staffing to logistics, we manage every detail so you can focus on your goals.",
    image: require("../../assets/images/onboard3.png"),
  },
  {
    id: 4,
    title: "Photo Booth",
    description:
      "Whether you're hosting a wedding, corporate event, or a birthday party, our photo booth is the perfect way to capture the excitement and joy of the occasion. Contact us today to learn more about our photo booth packages and to book your event.",
    image: require("../../assets/images/onboard4.png"),
  },
];

const GetStarted = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleContinue = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push("/selectUser");
    }
  };

  const renderItem = ({ item }: { item: (typeof ONBOARDING_DATA)[0] }) => (
    <View width={SCREEN_WIDTH} flex style={{ backgroundColor: "#000" }}>
      {/* Image Section - Top ~60% */}
      <View
        style={{
          width: "100%",
          height: verticalScale(300),
          overflow: "hidden"
        }}
      >
        <Image
          source={item.image}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </View>

      {/* Content Section - Bottom ~40% */}
      <View flex paddingH-24 paddingT-24>
        <Text
          bold
          large24
          white
          center
          style={{ lineHeight: moderateScale(32), color: "#fff" }}
        >
          {item.title}
        </Text>
        <Text
          regular
          small
          center
          marginT-12
          style={{
            lineHeight: moderateScale(20),
            color: "#818898",
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  const isLastSlide = currentIndex === ONBOARDING_DATA.length - 1;

  return (
    <View flex style={{ backgroundColor: "#000" }}>
      {/* Header - Skip button only */}
      <View row centerV paddingH-24 style={{ justifyContent: "flex-end" }}>
        <TouchableOpacity
          paddingV-8
          paddingH-20
          onPress={() => router.push("/selectUser")}
        >
          <Text white medium extraSmall style={{ color: "#fff" }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <View flex marginT-10>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id.toString()}
          bounces={false}
        />
      </View>

      {/* Bottom Section */}
      <View paddingH-24 paddingB-40>
        {/* Pagination Dots */}
        <View row centerH marginB-24>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              width={moderateScale(8)}
              height={moderateScale(8)}
              backgroundColor={
                currentIndex === index ? theme.color.onboardingBlue : "#6C6C6C"
              }
              marginH-4
              style={{ borderRadius: moderateScale(4) }}
            />
          ))}
        </View>

        {/* Continue / Get Started Button */}
        {isLastSlide ? (
          <CustomButton
            variant="onboarding"
            label="Get Started"
            onPress={handleContinue}
          />
        ) : (
          <TouchableOpacity
            onPress={handleContinue}
            style={{
              width: moderateScale(56),
              height: moderateScale(56),
              borderRadius: moderateScale(28),
              backgroundColor: theme.color.onboardingBlue,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              vector="Ionicons"
              name="chevron-forward"
              size={28}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GetStarted;
