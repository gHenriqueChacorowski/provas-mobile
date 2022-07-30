import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import GrupoConteudoEnum from '../enum/GrupoConteudoEnum';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import styles from "../styles/index";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core'
import NetInfo from "@react-native-community/netinfo";

export default function RealizarProva({ route }) {
  const [provas, setProvas] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [widthArr, setWidthArr] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setTableHead(['#', 'Título', 'Realização em']);
    setWidthArr([60, 175, 140]);

    const getProvas = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      const params = {
        inicio: '2022-05-17',
        fim: '2022-09-17',
        grupoConteudoId: GrupoConteudoEnum.COLEGIO_INTEGRADO
      }

      await api
        .get(`alunoProva/by/aluno/periodo/${usuario.id}`, { params })
        .then(async (res) => {
          let arrayProvas = [];
          res.data.filter(prova => {
            if (!prova.provaRealizada) {
              arrayProvas.push(prova);
            }
          });

          setProvas(arrayProvas);
          await AsyncStorage.setItem("provas", JSON.stringify(arrayProvas));
        })
        .catch(err => console.log(err));
    }

    const salvarRealizacaoProva = async () => {
      const respostas = await AsyncStorage.getItem("respostas").then(res => JSON.parse(res));
      const provaFinalizada = await AsyncStorage.getItem("provaFinalizada").then(res => JSON.parse(res));
      const logRespostas = await AsyncStorage.getItem("logRespostas").then(res => JSON.parse(res));

      if (logRespostas && logRespostas.length != null) {
        for (const log of logRespostas) {
          await api.post('logRealizacaoProva', log);
        }
        await AsyncStorage.removeItem("logRespostas");
        if (provaFinalizada && provaFinalizada != null) {
          if (respostas && respostas != null) {
            for (const resposta of respostas) {
              await api
                .post(`respostaAlunoProva/saveAlternativa`, resposta)
                .then(res => {
                  console.log('salvo');
                })
            }
            await AsyncStorage.removeItem("respostas");
          }
  
          await api
            .post("alunoProva/finalizarAlunoProva", provaFinalizada)
            .then(async (res) => {
              await AsyncStorage.removeItem("provaFinalizada");
            })
            .catch(err => {
              console.log(err);
            })
        }  
      }
    }

    if (route.params.reloadPage) {
      NetInfo.fetch().then(async (state) => {
        if (state.isConnected == true) {
          await AsyncStorage.removeItem("provas");
          getProvas();
          salvarRealizacaoProva();
        } else {
          const provas = await AsyncStorage.getItem("provas").then(res => JSON.parse(res));
          setProvas(provas);
        }
      })
    }
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1d1e1c' }}>Realizar Prova</Text>
      </View>
      {
        provas.length > 0
        ?
          <View>
            <Table style={{ margin: 10 }}>
              <Row data={tableHead} widthArr={widthArr} textStyle={ stylesDrawer.text } />
              {
                provas.map((value, key) => {
                  let realizacao = value.dataInicioProva;
                  realizacao += value.dataFimProva ? ` - ${value.dataFimProva}` : '';

                  return <Rows 
                    onPress={() => navigation.navigate('Prova', { aplicacaoProvaId: value.aplicacaoProvaId })} 
                    key={key} 
                    widthArr={widthArr} 
                    style={[ 
                      key % 2 && { backgroundColor: '#FCFCFC' }, 
                      { borderWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, borderColor: '#eee', 
                        paddingTop: 5, paddingBottom: 5 
                      }
                    ]} 
                    data={[[value.aplicacaoProvaId, value.nomeProva, realizacao]]} />
                })
              }
            </Table>
          </View>
       :
        <View style={{ paddingLeft: 10 }}>
          <Text style={{ fontSize: 15 }}>Nenhuma prova disponível para realização.</Text>
        </View>
      }
    </SafeAreaView>
  )
}

const stylesDrawer = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold'
  },
});