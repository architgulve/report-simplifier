import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Index = () => {
  return (
    <SafeAreaView>
      <View style={{ marginTop: 250, alignItems: "center" }}>
        <Text style={{ fontFamily: "serif", fontSize: 70 }}>Cura</Text>
      </View>
      <View style={{ width: "100%", marginTop: 300, alignItems: "center" }}>
        <Pressable
          onPress={() => router.push("/index_hm")}
          style={{
            width: "80%",
            height: 50,
            borderRadius: 25,
            backgroundColor: "#008CDB",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Index;
