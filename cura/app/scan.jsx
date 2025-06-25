import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import { useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Scanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
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
    const resizedUri = await resizeImage(uri);

    const formData = new FormData();
    formData.append("file", {
      uri: resizedUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    try {
      const res = await axios.post("http://<IP>:8000/ocr/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const responseText = res.data.text;
      console.log("Full LLM Response:", responseText);

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

      console.log("Medicine Data:", medicineData);
      console.log("Diet Recommendation:", dietText);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      await MediaLibrary.createAssetAsync(photo.uri);
      uploadImageToBackend(photo.uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadImageToBackend(uri);
    }
  };

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
    if (!permission?.granted) requestPermission();
    if (!mediaPermission?.granted) requestMediaPermission();
  }, []);

  if (!permission) {
    return <Text>Checking camera permissions...</Text>;
  }

  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#DFF6FB",
            // gap: 40,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "20%",
              zIndex: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              Scan the Document
            </Text>
          </View>
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "40%",
              backgroundColor: "#DFF6FB",
              zIndex: 1,
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "40%",
              backgroundColor: "#DFF6FB",
              zIndex: 1,
            }}
          ></View>
          <View
            style={{
              position: "absolute",
              width: "90%",
              height: "67%",
              borderRadius: 5,
              borderColor: "#C4CE2C",
              borderWidth: 5,
            }}
          ></View>
          <View
            style={{
              width: "75%",
              height: "60%",
              borderRadius: 5,
              overflow: "hidden",
              backgroundColor: "#000",
              zIndex: 1,
            }}
          >
            <CameraView
              ref={cameraRef}
              style={{
                // position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1,
                alignContent: "flex-end",
                justifyContent: "flex-start",
              }}
              facing="back"
              onCameraReady={() => setIsCameraReady(true)}
            >
              {/* <View
              style={{
                // position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1,
                alignContent: "flex-end",
                justifyContent: "flex-start",
              }}
            > */}
              <View
                style={{
                  backgroundColor: "#DFF6FB",
                  height: "30%",
                  widhth: "30%",
                  // alignSelf: "flex-end",
                  transformOrigin: "top",
                  transform: [{ translateX: "90%" }, { rotate: "45deg" }],
                }}
              ></View>
              {/* </View> */}
            </CameraView>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 50,
              zIndex: 2,
              alignContent: "center",
              justifyContent: "space-between",
              height: 0.2 * windowWidth,
              width: 0.9 * windowWidth,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <View
                style={{
                  width: 0.2 * windowWidth,
                  height: 0.2 * windowWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#131313",
                    opacity: 0.5,
                    width: 0.15 * windowWidth,
                    height: 0.15 * windowWidth,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={0.1 * windowWidth}
                    color="white"
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture}>
              <View
                style={{
                  borderColor: "#131313",
                  borderWidth: 2,
                  width: 0.2 * windowWidth,
                  height: 0.2 * windowWidth,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 0.18 * windowWidth,
                    height: 0.18 * windowWidth,
                    borderRadius: 50,
                    backgroundColor: "#008CDB",
                  }}
                ></View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={openGallery}>
              <View
                style={{
                  width: 0.2 * windowWidth,
                  height: 0.2 * windowWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#131313",
                    opacity: 0.5,
                    width: 0.15 * windowWidth,
                    height: 0.15 * windowWidth,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="images-outline"
                    size={0.1 * windowWidth}
                    color="white"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Scanner;
