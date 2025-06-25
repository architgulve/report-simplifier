import React, { useState } from "react";
import { View, Text, Button, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

const Upload = () => {
  const [storedPath, setStoredPath] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickAndStoreDocument = async () => {
    setIsUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false, // Try false first
      });

      console.log("DocumentPicker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.name;
        const sourceUri = asset.uri;

        // Ensure document directory exists
        const docDir = FileSystem.documentDirectory;
        const dirInfo = await FileSystem.getInfoAsync(docDir);

        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(docDir, { intermediates: true });
        }

        // Create unique filename
        const timestamp = Date.now();
        const newPath = `${docDir}${timestamp}_${fileName}`;

        console.log("Source URI:", sourceUri);
        console.log("Destination path:", newPath);

        // Check if source file exists and is readable
        const sourceInfo = await FileSystem.getInfoAsync(sourceUri);
        console.log("Source file info:", sourceInfo);

        if (!sourceInfo.exists) {
          throw new Error("Source file does not exist or is not accessible");
        }

        // Copy the file
        await FileSystem.copyAsync({
          from: sourceUri,
          to: newPath,
        });

        // Verify the copy was successful
        const copiedFileInfo = await FileSystem.getInfoAsync(newPath);
        console.log("Copied file info:", copiedFileInfo);

        if (copiedFileInfo.exists) {
          console.log("✅ Document successfully stored at:", newPath);
          setStoredPath(newPath);
          Alert.alert("Success", "Document saved successfully!");
        } else {
          throw new Error("File copy verification failed");
        }
      } else {
        console.log("Document selection cancelled");
      }
    } catch (error) {
      console.error("❌ Error storing document:", error);
      Alert.alert("Error", `Failed to store the document: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const testFileSystemAccess = async () => {
    try {
      const testPath = `${FileSystem.documentDirectory}test.txt`;
      await FileSystem.writeAsStringAsync(testPath, "test content");
      const testInfo = await FileSystem.getInfoAsync(testPath);
      console.log("File system test successful:", testInfo);
      await FileSystem.deleteAsync(testPath);
      Alert.alert("Success", "File system access is working!");
    } catch (error) {
      console.error("File system test failed:", error);
      Alert.alert("Error", `File system test failed: ${error.message}`);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Upload Document
        </Text>

        <Text style={{ marginBottom: 30, textAlign: "center" }}>
          Please select a document to upload. It will be saved locally in the
          app's document directory.
        </Text>

        <Button
          title={isUploading ? "Uploading..." : "📄 Select Document"}
          onPress={pickAndStoreDocument}
          disabled={isUploading}
        />

        <View style={{ marginTop: 20 }}>
          <Button
            title="🔧 Test File System"
            onPress={testFileSystemAccess}
            color="#orange"
          />
        </View>

        {storedPath && (
          <View style={{ marginTop: 20, maxWidth: "100%" }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Saved to:</Text>
            <Text
              style={{
                color: "gray",
                marginTop: 5,
                fontSize: 12,
                flexWrap: "wrap",
              }}
            >
              {storedPath}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: "gray", textAlign: "center" }}>
            Platform: {Platform.OS}
          </Text>
          <Text style={{ fontSize: 12, color: "gray", textAlign: "center" }}>
            Doc Directory: {FileSystem.documentDirectory}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Upload;
