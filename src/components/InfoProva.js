import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core'
import RenderHtml from 'react-native-render-html';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';

export default function InfoProva(props) {
  const [prova, setProva] = useState([]);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const getInfoProva = async (aplicacaoProvaId) => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));

      await api
      .get(`aplicacaoProva/by/all/info/disponivel/${aplicacaoProvaId}/${usuario.id}`)
      .then(async (res) => {
        setProva(res.data.infoProva);
        await AsyncStorage.setItem("infoProva", JSON.stringify(res.data.infoProva));
        await AsyncStorage.setItem("aplicacaoProva", JSON.stringify(res.data.aplicacaoProva));
        await AsyncStorage.setItem("questoesIds", JSON.stringify(res.data.questoesIds));
        await AsyncStorage.setItem("questoes", JSON.stringify(res.data.questoes));
      })
      .catch(err => console.log(err));
    }

    if (props.aplicacaoProvaId) {
      NetInfo.fetch().then(async (state) => {
        if (state.isConnected == true) {
          getInfoProva(props.aplicacaoProvaId);
          setDisabled(true);
        } else {
          const provas = await AsyncStorage.getItem("infoProva").then(res => JSON.parse(res));
          setProva(provas);
          setDisabled(false);
        }
      })
    }
  }, [props]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView>
        <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1d1e1c' }}>{ prova.nome }</Text>
          <RenderHtml style={{ fontSize: 15 }} source={{ html: prova.descricao ? prova.descricao : '' }} contentWidth={ width } />

          <View style={{ marginTop: 12,  borderBottomColor: '#eee', borderBottomWidth: 1, marginBottom: 10 }} />

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1d1e1c', marginBottom: 15 }}>Instruções</Text>
          <RenderHtml source={{ html: prova.instrucoes ? prova.instrucoes : '' }} contentWidth={ width } />

          <TouchableOpacity
            style={{
              marginTop: 20,
              borderRadius: 3,
              alignSelf: 'stretch',
              backgroundColor: "#356be8",
              color: "#fff",
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={disabled}
            onPress={() => navigation.navigate('Prova', { provaIniciada: true })} 
          >
            <Text
              style={{
                fontSize: 20,
                lineHeight: 41,
                color: "#fff"
              }}
            >
              Iniciar Prova
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}