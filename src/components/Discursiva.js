import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Discursiva(props) {
  const [questao, setQuestao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resposta, setResposta] = useState(null);

  useEffect(() => {
  }, [props]);

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <TextInput
        multiline={true}
        numberOfLines={10}
        onChangeText={(value) => {
          setResposta(value);
        }}
        value={resposta}
        style={{ height:200, textAlignVertical: 'top' }}
        placeholder="Resposta"
      />
    </SafeAreaView>
  )
}