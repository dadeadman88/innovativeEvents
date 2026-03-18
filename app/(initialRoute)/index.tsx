import { router } from "expo-router";
import * as React from "react";
import { useEffect } from "react";
import { Image, View } from "react-native-ui-lib";

interface SplashProps { }

const Splash = (props: SplashProps) => {

  useEffect(() => {
    setTimeout(() => {
      router.push("/getStarted");
    }, 2000);
  }, []);

  return (
    <View flex>
      <Image
        source={require("../../assets/images/Splash.png")}
        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
      />
    </View>
  );
};

export default Splash;
