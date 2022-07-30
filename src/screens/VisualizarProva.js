import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core'
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";

export default function VisualizarProva({ route }) {
  const [provas, setProvas] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [widthArr, setWidthArr] = useState([]);
  const navigation = useNavigation();
  const [netInfo, setNetInfo] = useState(false);

  useEffect(() => {
    setTableHead(['Descrição', 'Prova', 'Nota']);
    setWidthArr([175, 140, 60]);

    const getProvas = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      const params = {
        inicio: '2022-01-17',
        fim: '2022-09-17',
        notaLiberada: 1
      }

      await api
        .get(`alunoProva/by/aluno/${usuario.id}`, { params })
        .then(res => setProvas(res.data))
        .catch(err => console.log(err));
    }

    if (route.params.reloadPage) {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          getProvas();
          setNetInfo(false);
        } else {
          setNetInfo(true);
        }
      })
    }
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView>
        <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1d1e1c' }}>Visualizar Prova</Text>
        </View>
        {
          netInfo
          ?
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 15, color: 'red'}}>Visualização das provas indisponíveis no modo avião!!</Text>
            </View>
          :
            <View>
              {
                provas.length > 0
                ?
                  <View>
                    <Table style={{ margin: 10 }}>
                      <Row data={tableHead} widthArr={widthArr} textStyle={ stylesDrawer.text } />
                      {
                        provas.map((value, key) => {
                          return <Rows
                            onPress={() => navigation.navigate('ConsultarProva', { aplicacaoProvaId: value.aplicacaoProvaId, provaId: value.provaId, alunoId: value.alunoId })}  
                            key={key} 
                            widthArr={widthArr} 
                            style={{ backgroundColor: '#FCFCFC', borderWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, borderColor: '#eee', paddingTop: 5, paddingBottom: 5 }} 
                            data={[[value.descricao, value.nomeProva, value.nota]]} />
                        })
                      }
                    </Table>
                  </View>
                :
                  <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 15 }}>Nenhuma prova disponível para visualização.</Text>
                  </View>
              }
            </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const stylesDrawer = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold'
  },
});