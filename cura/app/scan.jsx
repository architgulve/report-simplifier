import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'


const Scanner = () => {
  return (
    <SafeAreaView edges={["top"]} 
    style={{
      backgroundColor: "#DFF6FB",
      flex: 1,
    }}
    >
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content"/>
      <View style={{ flex: 1 }}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#DFF6FB",
        }}>
          {/* <MeshGradient>

          </MeshGradient> */}

        </View>
      </View>
    </SafeAreaView>

  )
}

export default Scanner