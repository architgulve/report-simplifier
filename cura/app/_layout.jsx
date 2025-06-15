// import { View, Text } from "react-native";
// import React from "react";
// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler"; // ✅ import this
// import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ optional but good
// import "../global.css";

// const RootLayout = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       {" "}
//       {/* ✅ wrap everything */}
//       <SafeAreaProvider>
//         <Stack>
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="settings" options={{ headerShown: false }} />
//         </Stack>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default RootLayout;


import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font'; // ✅

const RootLayout = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Lobster: require('../assets/fonts/Lobster-Regular.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null; // Don't render anything until fonts are loaded

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index"  options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
