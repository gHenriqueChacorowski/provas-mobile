import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import Alternativa from './Alternativa';
import Discursiva from './Discursiva';
import ConteudoQuestao from './ConteudoQuestao';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/core'

export default function Questao(props) {
  const [questao, setQuestao] = useState([]);
  const [alunoId, setAlunoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anulada, setAnulada] = useState(null);
  const [ordem, setOrdem] = useState(null);
  const [nota, setNota] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getQuestao = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      setAlunoId(usuario.id);
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

    const getInfoQuestaoStorage = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      const questoes = await AsyncStorage.getItem("questoes").then(res => JSON.parse(res));

      const questao = questoes.find(item => item.questaoId == props.questaoId);
      await AsyncStorage.setItem("questao", JSON.stringify(questao.questao));

      setQuestao(questao.questao);
      setAlunoId(usuario.id);
      setIsLoading(false);
    }

    if (props) {
      if (props.revisao) {
        getQuestao();
      } else {
        NetInfo.fetch().then(async (state) => {
          if (state.isConnected == true) {
            navigation.navigate('RealizarProva', { reloadPage: true })
          } else {
            getInfoQuestaoStorage();
          }
        })
      }

    }
  }, [props]);

  if (isLoading) {
    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator 
          size="large"
          color={"blue"}
          animating={true}
          style={{alignSelf: 'center', justifyContent: 'center', position:'absolute'}}
        />
      </View>
    )
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <ConteudoQuestao 
        questaoId={questao.id} 
        titulo={questao.titulo} 
        respostaEsperada={questao.respostaEsperada} 
        nota={nota} 
        ordem={props.questaoAtual ? props.questaoAtual : questao.ordem} 
      />
      {
        questao.tipoId != 6
        ?
        <Alternativa 
          alternativas={questao.alternativas} 
          questaoId={props.questaoId} 
          tituloQuestao={questao.titulo} 
          tipoId={questao.tipoId} 
          aplicacaoProvaId={props.aplicacaoProvaId} 
          provaId={props.provaId}
          ordem={props.questaoAtual ? props.questaoAtual : ordem}
          alunoId={alunoId}  
          revisao={props.revisao ? props.revisao : false}
        />
        :
        <Discursiva 
          questaoId={questao.id} 
          tituloQuestao={questao.titulo} 
          tipoId={questao.tipoId} 
          aplicacaoProvaId={props.aplicacaoProvaId} 
          provaId={props.provaId}
          ordem={props.questaoAtual ? props.questaoAtual : ordem}  
          alunoId={alunoId}
          revisao={props.revisao ? false : props.revisao}
        />
      }
    </SafeAreaView>
  )
}