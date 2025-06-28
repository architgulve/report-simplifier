import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addNoti } from "../../utility/database";

const Confirmation = () => {
  const [mediData, setMediData] = useState([]);

  const fetchData = async () => {
    try {
      const tempData = await AsyncStorage.getItem("medicineData");
      if (tempData) {
        const parsed = JSON.parse(tempData);
        setMediData(parsed);
      }
    } catch (err) {
      console.error("❌ Error parsing medicineData:", err);
    }
  };

  const handleAcceptPress = async () => {
    for (const med of mediData) {
      const result = await addNoti(med.name, med.time);
      if (result) {
        console.log("✅ Notification added successfully for", med.name);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: "#DFF6FB",
        flex: 1,
      }}
    >
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <LottieView
            source={require("../../assets/animations/AIHeart.json")}
            autoPlay
            loop
            style={{
              width: 50,
              height: 50,
            }}
          ></LottieView>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              // marginBottom: 20,
            }}
          >
            Medicines Found
          </Text>
        </View>
        <ScrollView
          style={{
            height: "80%",
          }}
        >
          {mediData.length === 0 ? (
            <Text>Loading...</Text>
          ) : (
            mediData.map((med, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "white",
                  marginBottom: 15,
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  {med.name}
                </Text>
                <Text>Time: {med.time}</Text>

                <View style={{ marginTop: 10 }}>
                  {/* {med.morning && <Text>🕗 Morning: Yes</Text>}
                  {med.afternoon && <Text>🌤️ Afternoon: Yes</Text>}
                  {med.evening && <Text>🌙 Evening: Yes</Text>} */}
                </View>
              </View>
            ))
          )}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "50%",
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.navigate("/scan");
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close-circle" size={24} color="red" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "red",
                    marginLeft: 5,
                  }}
                >
                  Scan Again
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "50%",
              padding: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleAcceptPress();
                router.navigate("/(tabs)/(medireminders)/remind");
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <Ionicons name="checkmark-circle" size={24} color="green" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "green",
                    marginLeft: 5,
                  }}
                >
                  Accept
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Confirmation;
