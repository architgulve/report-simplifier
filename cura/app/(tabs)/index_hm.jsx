import { View, Text, StatusBar } from "react-native";
import React, { useCallback, useEffect } from "react";
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
import { router, useFocusEffect } from "expo-router";
import HomeReminderPreview from "../../components/homepageremind";
import LottieView from "lottie-react-native";
import {
  initializeDatabase,
  insertSetting,
  getSettings,
  insertDiet,
  getLatestDiet,
} from "../../utility/database";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [pdr, setPdr] = useState(
    "Scan your report to generate a personalized diet plan."
  );

  const setTimes = async () => {
    await AsyncStorage.setItem("morningTime", "09:00");
    await AsyncStorage.setItem("afternoonTime", "13:00");
    await AsyncStorage.setItem("nightTime", "20:00");
  };

  const loadDiet = async () => {
    try {
      const storedDiet = await AsyncStorage.getItem("dietRecommendation");
      if (storedDiet !== null) {
        setPdr(cleanDietText(storedDiet));
      }
    } catch (e) {
      console.error("Error loading diet:", e);
    }
  };
  const cleanDietText = (text) => {
    return text
      .replace(/^\s*Diet Recommendation:\s*/i, "")
      .replace(/^\s*\*\*Diet Recommendation\*\*\s*/i, "")
      .trim();
  };

  // useEffect(() => {
  //   loadDiet();
  // }, []);

  useEffect(() => {
    initializeDatabase();
    setTimes();
  }, []);

  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(true);
  const [previewMeds, setPreviewMeds] = useState([]);

  useEffect(
    useCallback(() => {
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
    })
  );

  const getGreeting = () => {
    const name = userName || "Guest";

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
              justifyContent: "space-between",
            }}
          >
            <Image source={require("../../assets/images/CuraLogo.png")} 
            style={{ resizeMode: "contain", width: 50, height: 50 }}/>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              Cura
            </Text>
            <View
              style={{
                alignItems: "right",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.push("/settings");
                }}
              >
                <Ionicons name="settings" size={30} color="black" />
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
            <HomeReminderPreview />
          </View>

          <View style={styles.recommendationCard}>
            <View style={styles.goalHeader}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
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
                <Text style={styles.goalTitle}> AI Recommendation</Text>
              </View>
              <TouchableOpacity
                onPress={loadDiet}
                style={{
                  padding: 5,
                }}
              >
                <Ionicons name="refresh-outline" size={22} color="grey" />
              </TouchableOpacity>
            </View>
            <Text style={styles.recommendationText}>{pdr}</Text>
          </View>
          <View
            style={{
              padding: 50,
            }}
          ></View>
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
                backgroundColor: "#007AFF",
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
                    onPress={() => router.push("/(scanupload)/scan")}
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
                        Scan Report
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      {
                        // backgroundColor: "white",
                      }
                    }
                    onPress={() => router.push("/(scanupload)/upload")}
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
                        Upload Report
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E6FAFD",
    flex: 1,
  },
  innerContainer: {
    paddingTop: 50, // increased from 24 to 100
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    color: "#555",
  },
  goalCard: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 0,
  },
  progressContainer: {
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#333",
  },
  value: {
    fontSize: 13,
    color: "#333",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 4,
  },
  mealSection: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  mealHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 6,
  },
  mealSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  mealCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  mealTime: {
    fontSize: 12,
    color: "#555",
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
  },
  caloriesText: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  mealItems: {
    marginTop: 10,
  },
  mealItemText: {
    fontSize: 14,
    color: "#333",
  },
  actionButtonWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionButtonText: {
    fontWeight: "bold",
    color: "#333",
  },
  recommendationCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    borderColor: "#FFC0CB",
    borderWidth: 0,
  },
  recommendationText: {
    marginTop: 4,
    fontSize: 16,
    color: "#333",
  },
});
