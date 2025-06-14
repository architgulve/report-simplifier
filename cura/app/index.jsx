import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Index = () => {
  return (
    <SafeAreaView>
      <View>
        <Text>Index</Text>
        <Pressable onPress={() => router.push("/home")}>
          <Text>Go to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Index;
