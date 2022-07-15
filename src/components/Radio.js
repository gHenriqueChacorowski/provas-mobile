import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet } from 'react-native'
import RenderHtml from 'react-native-render-html';

export default function Radio({ opcoes = [], onChangeOpcaoSelecionada, opcaoSelecionada }) {
  const opcoesAlternativas = ["A) ","B) ","C) ","D) ","E) ","F) ","G) ","H) ","I) ","J) ","K) ","L) ","M) ","N) ","O) "];
  let { width } = useWindowDimensions();

  useEffect(() => {
  }, [opcoes])

  return (
    <View>
      {
        opcoes.map((value, index) => {
          let descricao = value.descricao.replace('<p><br></p>', '');
          return (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', width: width - 80, margin: 5 }}
              onPress={() => {
                onChangeOpcaoSelecionada(value, index)
              }}
              key={index}
            >
              <View style={stylesRadio.circle}>
                {opcaoSelecionada == index && <View style={stylesRadio.opcaoSelecionada} />}
              </View>
              <Text style={{ marginBottom: 2}}> {opcoesAlternativas[index]} </Text>
              <RenderHtml source={{ html: descricao }} contentWidth={ width } />
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

const stylesRadio = StyleSheet.create({
  circle: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderColor: '#777',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  opcaoSelecionada: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
    borderWidth: 2
  }
});
