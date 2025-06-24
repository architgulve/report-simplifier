import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/index_hm");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View>
      <View
        style={{
          alignItems: "center",
          backgroundColor: "#DFF6FB",
        }}
      >
        <LottieView
          source={require("../assets/animations/FirstPage.json")}
          autoPlay
          loop
          style={{
            width: "100%",
            height: "100%",
          }}
        ></LottieView>
      </View>
    </View>
  );
};

export default Index;
