import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet, TextInput } from 'react-native'
import RenderHtml from 'react-native-render-html';
import CheckBox from '@react-native-community/checkbox';

export default function CheckBoxComponent({ opcoes = [], onChangeCheckBox, somatoria }) {
  let { width } = useWindowDimensions();
  const pesoString = ["01", "02", "04", "08", "16"];

  useEffect(() => {
  }, [opcoes])

  return (
    <View>
      {
        opcoes.map((value, key) => {
          let descricao = value.descricao.replace('<p><br></p>', '');
          return (
            <TouchableOpacity 
              key={key} 
              style={{ flexDirection: 'row', alignItems: 'center', width: width - 95 }} 
              onPress={() => { onChangeCheckBox(value, key)}}
            >
              <CheckBox
                tintColors={{ true: '#428BCA'}}
                value={value.checked}
                onValueChange={() => {
                  onChangeCheckBox(value, key)
                }}
              />
              <Text>{pesoString[key]})  </Text>
              <RenderHtml source={{ html: descricao }} contentWidth={ width } />
            </TouchableOpacity>
          )
        })
      }
      <View style={{marginLeft: 7, paddingBottom: 10}}>
        <Text>Total:</Text>
        <TextInput
          style={{borderWidth: 1, borderRadius: 2, width: 50, height: 40, color: '#000'}}
          value={somatoria.toString()}
          editable={false}
          keyboardType="numeric"
        />
      </View>
    </View>
  )
}
