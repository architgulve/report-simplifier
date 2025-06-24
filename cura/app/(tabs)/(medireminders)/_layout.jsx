import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MediRemindersLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='remind' options={{ headerShown: false }} />
      <Stack.Screen name='addmedications' options={{ headerShown: false }} />
    </Stack>
  )
}

export default MediRemindersLayout