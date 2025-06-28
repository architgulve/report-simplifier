import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ScanUploadLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='scan' options={{ headerShown: false }} />
      <Stack.Screen name='upload' options={{ headerShown: false }} />
      <Stack.Screen name='confirmation' options={{ headerShown: false }} />
    </Stack>
  )
}

export default ScanUploadLayout