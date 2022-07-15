import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Questao from './Questao';
import AsyncStorage from "@react-native-community/async-storage";

export default function Questoes(props) {
  const [aplicacaoProva, setAplicacaoProva] = useState([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [questoes, setQuestoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const proximaQuestao = async () => {
    console.log('proxima questao');
    if (questaoAtual < questoes.length - 1) {
      let value = questaoAtual;
      value += 1;
      setQuestaoAtual(value);
    }
  }

  const voltarQuestao = async () => {
    console.log('voltar Questao'); 
    if (questaoAtual > 0) {
      let value = questaoAtual;
      value -= 1;
      setQuestaoAtual(value);
    }
  }

  const finalizarProva = async () => {
    console.log('Prova finalizada');
  }

  useEffect(() => {
    const questoesIds = async (provaId, aplicacaoProvaId) => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      await api
        .get(`questaoProva/by/provaId/aplicacaoProvaId/alunoId/${provaId}/${aplicacaoProvaId}/${usuario.id}`)
        .then(res => {
          setQuestoes(res.data);
          setIsLoading(false);
        });
    }
    const getInfoAplicacaoProva = async () => {
      await api
        .get(`prova/aplicacaoProva/${props.aplicacaoProvaId}`)
        .then(res => {
          setAplicacaoProva(res.data.aplicacaoProvas[0]);
          questoesIds(res.data.aplicacaoProvas[0].provaId, res.data.aplicacaoProvas[0].id);
        })
        .catch(err => console.log(err));
    }

    if (props.aplicacaoProvaId) {
      getInfoAplicacaoProva();
    }
  }, [props.aplicacaoProvaId]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D8DBDE' }}>
      <ScrollView>
        <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 175 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1d1e1c', marginBottom: 15 }}>Questoes</Text>
          <Questao provaId={aplicacaoProva.provaId} aplicacaoProvaId={aplicacaoProva.id} questaoId={questoes[questaoAtual].questaoId} questaoAtual={questaoAtual + 1} />
        </View>
      </ScrollView>
      <View style={styles.headerbarBottomQuestoes}>
        <View style={styles.headerBottomItens}>
          <View>
            {
              questaoAtual > 0 &&
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    voltarQuestao();
                  }}
                >
                  <Text style={styles.btnDefault}>
                    <FontAwesomeIcon style={styles.iconLeft} icon={faChevronLeft} size={ 11 } />&nbsp; Anterior
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          {
            (questaoAtual + 1) < questoes.length
            ?
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    proximaQuestao();
                  }}
                >     
                  <Text style={styles.btnPrimary}>
                    Próximo &nbsp;<FontAwesomeIcon style={styles.iconRight} icon={faChevronRight} size={ 11 } />
                  </Text>
                </TouchableOpacity>
              </View>
            :
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    finalizarProva();
                  }}
                >     
                  <Text style={styles.btnPrimary}>
                    Finalizar Prova
                  </Text>
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  headerbarBottomQuestoes: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    top: 'auto',
    zIndex: 999
  },
  headerBottomItens: {
    borderLeftColor: '#eee',
    borderLeftWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  btnDefault: {
    backgroundColor: '#e4e7ea',
    borderRadius: 3,
    color: '#636e7b',
    paddingTop: 6,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 6,
    fontSize: 16   
  },
  btnPrimary: {
    backgroundColor: '#356be8',
    borderRadius: 3,
    color: '#fff',
    paddingTop: 6,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 6,
    fontSize: 16,  
  },
  navButton: {
    paddingTop: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 7
  },
  iconRight: {
    color: "#fff"
  },
  iconLeft: {
    color: "#636e7b"
  },
});