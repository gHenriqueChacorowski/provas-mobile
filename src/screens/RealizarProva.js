import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import GrupoConteudoEnum from '../enum/GrupoConteudoEnum';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import styles from "../styles/index";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core'

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
        fim: '2022-07-17',
        grupoConteudoId: GrupoConteudoEnum.COLEGIO_INTEGRADO
      }

      await api
        .get(`alunoProva/by/aluno/periodo/${usuario.id}`, { params })
        .then(res => {
          let arrayProvas = [];
          res.data.filter(prova => {
            if (!prova.provaRealizada) {
              arrayProvas.push(prova);
            }
          });

          setProvas(arrayProvas);
        })
        .catch(err => console.log(err));
    }

    if (route.params.reloadPage) {
      getProvas();
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