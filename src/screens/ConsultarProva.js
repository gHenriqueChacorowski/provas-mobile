import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ListProva from '../components/ListProva';

export default function ConsultarProva({ route }) {
  const [aplicacaoProvaId, setAplicacaoProvaId] = useState(null);

  useEffect(() => {
  }, [route.params]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ListProva aplicacaoProvaId={route.params.aplicacaoProvaId} provaId={route.params.provaId} alunoId={route.params.alunoId} />
    </SafeAreaView>
  )
}