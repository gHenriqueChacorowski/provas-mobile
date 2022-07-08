import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/core'
import RenderHtml from 'react-native-render-html';

export default function InfoProva(props) {
  const [prova, setProva] = useState([]);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const getInfoProva = async (aplicacaoProvaId) => {
      await api
      .get(`prova/aplicacaoProva/${aplicacaoProvaId}`)
      .then(res => setProva(res.data))
      .catch(err => console.log(err));
    }

    if (props.aplicacaoProvaId) {
      getInfoProva(props.aplicacaoProvaId);
    }
  }, [props.aplicacaoProvaId]);

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