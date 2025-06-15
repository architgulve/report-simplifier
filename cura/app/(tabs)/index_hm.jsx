import { View, Text, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native";

const Home = () => {
  const hours = new Date().getHours();

  let greeting = "Good Evening, Sarah!";
  if (hours < 12) {
    greeting = "Good Morning, Sarah!";
  } else if (hours < 18) {
    greeting = "Good Afternoon, Sarah!";
  }

  return (
    <SafeAreaView edges={["top"]} className="h-full bg-[#ffffff]">
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          alignItems: "left",
          flexDirection: "row",
          padding: 20,
          backgroundColor: "#ffffff",
        }}
      >
        {/* // Header Section */}
        <Image source={require("../../assets/images/homepageicon.png")} />
        <Text
          style={{
            fontSize: 40,
            fontFamily: "Lobster",
          }}
        >
          Cura
        </Text>
        <View
          style={{
            alignItems: "right",
            marginLeft: 180,
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/images/settings.png")}
            style={{ width: 30, height: 30 }}
          />
        </View>
      </View>
      <ScrollView className="h-full bg-[#DFF6FB]">
        <View style={{ backgroundColor: "#DFF6FB", height: "100%" }}>
          <View
            style={{
              margin: 25,
              padding: 5,
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 24 }}>{greeting}</Text>
            <Text stle={{ fontSize: 16, lineHeight: 30 }}>
              Let's keep track of your Health today
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#008CDB",
                padding: 25,
                borderRadius: 10,
                flexDirection: "row",
              }}
            >
              <Icon name="heartbeat" size={25} color="white" />
              <View style={{ marginLeft: 10, lineHeight: 30 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    lineHeight: 30,
                    marginTop: 0,
                    color: "white",
                  }}
                >
                  Heart Rate
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    lineHeight: 30,
                    marginTop: 0,
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  72bpm
                </Text>
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: "#27D240",
                padding: 20,
                borderRadius: 10,
                flexDirection: "row",
              }}
            >
              <Ionicons name="walk" size={30} color="white" />
              <View style={{ marginLeft: 10, lineHeight: 30 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    lineHeight: 30,
                    marginTop: 0,
                    color: "white",
                  }}
                >
                  Steps Today
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
                >
                  2,500
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              widht: "100%",
              height: "auto",
              margin: 15,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="alarm-outline" size={30} color="black" />
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}
              >
                Medication Reminders
              </Text>
            </View>
            <View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  widht: "100%",
                  height: 70,
                  marginTop: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <View
                  style={{
                    width: "55%",
                    height: 50,
                    alignItems: "left",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Text>Lisinopril</Text>
                  <Text>02:00pm</Text>
                </View>
                <View
                  style={{
                    width: "45%",
                    height: 45,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFB6C1",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "darkred", fontWeight: "bold" }}>
                    Due Now
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  widht: "100%",
                  height: 70,
                  marginTop: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <View
                  style={{
                    width: "55%",
                    height: 50,
                    alignItems: "left",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Text>Metformin</Text>
                  <Text>09:00pm</Text>
                </View>
                <View
                  style={{
                    width: "45%",
                    height: 45,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#C0C0C0",
                    borderRadius: 10,
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "grey", fontWeight: "bold" }}>
                    Upcoming
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  widht: "50%",
                  height: 50,
                  marginTop: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="black"
                />
                <Text>View All Reminders</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              widht: "100%",
              height: "auto",
              margin: 10,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="checkbox-outline" size={20} color="black" />
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10 }}
              >
                Recent Report
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>
                Your latest health report is ready. Please review it to ensure
                your health is on track.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
