import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const initialDietRef = useRef("");
  const [diet, setDiet] = useState("");
  const windowWidth = Dimensions.get("window").width;

  const resizeImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  };

  const uploadImageToBackend = async (uri) => {
    setLoading(true);
    const resizedUri = await resizeImage(uri);

    const formData = new FormData();
    formData.append("file", {
      uri: resizedUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const res = await axios.post("http://<IP address>:8000/ocr/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseText = res.data.text;
      const startIndex = responseText.indexOf("[");
      const endIndex = responseText.indexOf("]") + 1;
      const jsonPart = responseText.slice(startIndex, endIndex);
      const dietPart = responseText.slice(endIndex).trim();

      let medicineData = [];
      try {
        medicineData = JSON.parse(jsonPart);
      } catch (e) {
        console.error("Failed to parse medicine JSON:", e, jsonPart);
      }

      const dietText = dietPart.startsWith("Diet Recommendation:")
        ? dietPart
        : "Diet Recommendation:\n" + dietPart;

      await AsyncStorage.setItem("dietRecommendation", dietText);
      await AsyncStorage.setItem("medicineData", JSON.stringify(medicineData));
      setDiet(dietText);
      router.push("/confirmation");
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      await uploadImageToBackend(uri);
    }
  };

  useEffect(() => {
    if (!mediaPermission?.granted) requestMediaPermission();
    const getInitialDiet = async () => {
      const stored = await AsyncStorage.getItem("dietRecommendation");
      initialDietRef.current = stored || "";
    };
    getInitialDiet();
  }, []);

  useEffect(() => {
    if (diet.trim() && diet !== initialDietRef.current) {
      setLoading(false);
      router.push("/confirmation");
    }
  }, [diet]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#DFF6FB",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!loading && (
        <>
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: "#008CDB",
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 30,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="images-outline"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Select Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/scan")}
            style={{
              backgroundColor: "#008CDB",
              paddingVertical: 15,
              paddingHorizontal: 30,
              borderRadius: 30,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Ionicons
              name="camera-outline"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Scan Report
            </Text>
          </TouchableOpacity>
        </>
      )}

      {loading && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#DFF6FB",
            paddingTop: 50,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              position: "absolute",
              top: 100,
            }}
          >
            Let's see what we can do for you...
          </Text>
          <LottieView
            source={require("../../assets/animations/AIHeart.json")}
            autoPlay
            loop
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Upload;
