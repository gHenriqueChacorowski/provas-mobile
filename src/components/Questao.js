import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import Alternativa from './Alternativa';
import Discursiva from './Discursiva';

export default function Questao(props) {
  const [questao, setQuestao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anulada, setAnulada] = useState(null);
  const [ordem, setOrdem] = useState(null);

  useEffect(() => {
    const getQuestao = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      await api
        .get(`questao/by/provaId/questaoId/aplicacaoProvaId/alunoId/${props.provaId}/${props.questaoId}/${props.aplicacaoProvaId}/${usuario.id}`)
        .then(res => {
          setQuestao(res.data);
          setAnulada(res.data.questaoProvas[0].anulada);
          setOrdem(res.data.questaoProvas[0].ordem);
          setIsLoading(false);
        })
        .catch(err => console.log(err));
    }

    if (props) {
      console.log('if do props');
      getQuestao();
    }
  }, [props.questaoId, props.provaId]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      {
        questao.tipoId != 6
        ?
        <Alternativa 
          alternativas={questao.alternativas} 
          questaoId={questao.id} 
          tituloQuestao={questao.titulo} 
          tipoId={questao.tipoId} 
          aplicacaoProvaId={props.aplicacaoProvaId} 
          provaId={props.provaId}
          ordem={props.questaoAtual ? props.questaoAtual : ordem}  
        />
        :
        <Discursiva 
          questaoId={questao.id} 
          tituloQuestao={questao.titulo} 
          tipoid={questao.tipoId} 
          aplicacaoProvaId={props.aplicacaoProvaId} 
          provaId={props.provaId}
          ordem={props.questaoAtual ? props.questaoAtual : ordem}  
        />
      }
    </SafeAreaView>
  )
}