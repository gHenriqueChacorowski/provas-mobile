import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import Questao from './Questao';
import RenderHtml from 'react-native-render-html';

export default function ListProva(props) {
  const [prova, setProva] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  let { width } = useWindowDimensions();

  useEffect(() => {
    const getInfoProva = async (id) => {
      await api
        .get(`prova/aplicacaoProva/${id}`)
        .then(res => {
          setProva(res.data)
          console.log('oi');
        })
        .catch(err => console.log(err))
    }

    const questoesIds = async (provaId, aplicacaoProvaId, alunoId) => {
      await api
        .get(`questaoProva/by/provaId/aplicacaoProvaId/alunoId/${provaId}/${aplicacaoProvaId}/${alunoId}`)
        .then(res => {
          setQuestoes(res.data);
        });
    }

    if (props) {
      getInfoProva(props.aplicacaoProvaId);
      questoesIds(props.provaId, props.aplicacaoProvaId, props.alunoId)
    }

  }, [props]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D8DBDE' }}>
      <ScrollView>
        {
          prova &&
          <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1d1e1c' }}>{ prova.nome }</Text>
            <RenderHtml style={{ fontSize: 15 }} source={{ html: prova.descricao ? prova.descricao : '' }} contentWidth={ width } />
            {
              questoes &&
              questoes.map((q, key) => {
                return (
                  <View>
                    <Questao
                      provaId={props.provaId}
                      questaoId={questoes[key].questaoId}
                      aplicacaoProvaId={props.aplicacaoProvaId}
                      questaoAtual={key + 1}
                      revisao={true}
                    />
                    <View style={{borderBottomColor: '#000', borderBottomWidth: 1}} />
                  </View>
                )
              })
            }
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}