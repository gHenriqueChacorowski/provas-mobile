import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import TipoQuestaoEnum from '../enum/TipoQuestaoEnum';

export default function Discursiva(props) {
  const [questao, setQuestao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('discursiva');
  }, [props]);

  // if (isLoading) {
  //   return <View><Text>Loading...</Text></View>
  // }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <View><Text>Discursiva</Text></View>
    </SafeAreaView>
  )
}