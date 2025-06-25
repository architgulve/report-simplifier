import { View, Text, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native";
import { TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useState } from "react";
import { router } from "expo-router";
import {
  initializeDatabase,
  insertSetting,
  getSettings,
} from "../../utility/database";
import HomeReminderPreview from "../../components/homepageremind";


const Home = () => {
  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(true);
  const [previewMeds, setPreviewMeds] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        initializeDatabase();
        const settings = await getSettings();

        if (settings && settings.name) {
          setUserName(settings.name);
        } else {
          setUserName("Guest"); // Default fallback
        }
      } catch (error) {
        console.log("Error loading user data:", error);
        setUserName("Guest"); // Fallback on error
      } finally {
        setIsLoading(false);
      }
    };


    loadUserData();

    const fetchData = async () => {
      await createMedicineTable();
      const meds = await getAllMedicines();

      const takenMapStr = await AsyncStorage.getItem("takenStatus");
      const takenMap = takenMapStr ? JSON.parse(takenMapStr) : {};

      const formatted = [];

      meds.forEach((med) => {
        const times = med.TimeToBeTakenAt.split(",");
        const dosage = med.QuantityTablet || med.QuantityLiquid || 0;

        times.forEach((time, index) => {
          const timeLabel =
            index === 0 ? "Morning" : index === 1 ? "Afternoon" : "Night";
          const medId = `${med.MedicineID}-${index}`;

          if (time && time.trim()) {
            formatted.push({
              id: medId,
              name: med.MedicineName,
              time: time.trim(),
              timeSlot: timeLabel,
              taken: takenMap[medId] ?? false,
            });
          }
        });
      });

      formatted.sort((a, b) => a.time.localeCompare(b.time));
      setPreviewMeds(formatted.slice(0, 2)); // Show only first 2
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const name = userName || 'Guest';
    
    if (hours < 12) {
      return `Good Morning, ${name}!`;
    } else if (hours < 18) {
      return `Good Afternoon, ${name}!`;
    } else {
      return `Good Evening, ${name}!`;
    }
  };

  const hours = new Date().getHours();
  const [fabExpanded, setFabExpanded] = useState(false);
  const fabSize = useSharedValue(60);
  const fabOpacity = useSharedValue(0);

  const fabStyle = useAnimatedStyle(() => ({
    width: withTiming(fabExpanded ? 200 : 60),
    height: withTiming(fabExpanded ? 120 : 60),
    borderRadius: withTiming(fabExpanded ? 20 : 30),
  }));
  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(fabExpanded ? 1 : 0, {
      duration: 1000,
    }),
  }));

  
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: "#DFF6FB",
        flex: 1,
      }}
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#DFF6FB",
          }}
        >
          <View
            style={{
              alignItems: "left",
              flexDirection: "row",
              padding: 20,
              backgroundColor: "#ffffff",
            }}
          >
            <Image source={require("../../assets/images/homepageicon.png")} />
            <Text
              style={{
                fontSize: 40,
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
              <TouchableOpacity
                onPress={() => {
                  router.push("/settings");
                }}
              >
                <Image
                  source={require("../../assets/images/settings.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              // height: "100%",
              flex: 1,
            }}
          >
            <View
              style={{
                margin: 10,
                padding: 5,
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: "#333",
                textAlign: "center",
              }}
            >
              {isLoading ? "Loading..." : getGreeting()}
            </Text>
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
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    2,500
                  </Text>
                </View>
              </View>
            </View>
          <HomeReminderPreview/>
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

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setFabExpanded((prev) => !prev)}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 2,
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: "#008CDB",
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                // opacity: 0.9,
              },
              fabStyle,
            ]}
          >
            {!fabExpanded ? (
              <Ionicons name="add" size={32} color="white" />
            ) : (
              <>
                <Animated.View style={[{ gap: 16 }, optionsStyle]}>
                  <TouchableOpacity
                    onPress={() => router.push("/scan")}
                    style={
                      {
                        // backgroundColor: "white",
                      }
                    }
                  >
                    <View
                      style={{
                        // backgroundColor: "#fff",
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Ionicons name="camera-outline" size={20} color="white" />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Scan Document
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      {
                        // backgroundColor: "white",
                      }
                    }
                    onPress={() => router.push("/upload")}
                    
                  >
                    <View
                      style={{
                        // backgroundColor: "#fff",
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        flexDirection: "row",
                        gap: 10,
                      }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color="white"
                      />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Upload Document
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>

        {fabExpanded && (
          <TouchableWithoutFeedback onPress={() => setFabExpanded(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                zIndex: 1,
              }}
            ></View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;