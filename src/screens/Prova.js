import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoProva from '../components/InfoProva';
import Questoes from '../components/Questoes';

export default function Prova({ route }) {
  const [aplicacaoProvaId, setAplicacaoProvaId] = useState(null);
  const [provaIniciada, setProvaIniciada] = useState(false); 

  useEffect(() => {
    if (route.params.provaIniciada) {
      setProvaIniciada(true);
    } else {
      setProvaIniciada(false);
    }

    if (route.params.aplicacaoProvaId) setAplicacaoProvaId(route.params.aplicacaoProvaId);
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {
        provaIniciada == false
        ?
        <InfoProva aplicacaoProvaId={aplicacaoProvaId} />
        :
        <Questoes aplicacaoProvaId={aplicacaoProvaId} />
      }
    </SafeAreaView>
  )
}