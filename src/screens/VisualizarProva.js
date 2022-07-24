import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text } from 'react-native'
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import GrupoConteudoEnum from '../enum/GrupoConteudoEnum';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import styles from "../styles/index";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VisualizarProva({ route }) {
  const [provas, setProvas] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [widthArr, setWidthArr] = useState([]);

  useEffect(() => {
    setTableHead(['Descrição', 'Prova', 'Nota']);
    setWidthArr([175, 140, 60]);

    const getProvas = async () => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      const params = {
        inicio: '2022-05-17',
        fim: '2022-07-17'
      }

      await api
        .get(`alunoProva/by/aluno/${usuario.id}`, { params })
        .then(res => setProvas(res.data))
        .catch(err => console.log(err));
    }

    if (route.params.reloadPage) {
      getProvas();
    }
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1d1e1c' }}>Visualizar Prova</Text>
      </View>
      {
        provas.length > 0
        ?
        <View>
          <Table style={{ margin: 10 }}>
            <Row data={tableHead} widthArr={widthArr} />
            {
              provas.map((value, key) => {
                return <Rows key={key} widthArr={widthArr} style={{ backgroundColor: '#FCFCFC', borderWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, borderColor: '#eee', paddingTop: 5, paddingBottom: 5 }} data={[[value.descricao, value.nomeProva, value.nota]]} />
              })
            }
          </Table>
        </View>
        :
        <View style={{ paddingLeft: 10 }}>
          <Text style={{ fontSize: 15 }}>Nenhuma prova disponível para visualização.</Text>
        </View>
      }
    </SafeAreaView>
  )
}