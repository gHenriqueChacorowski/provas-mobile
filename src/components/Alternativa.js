import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import TipoQuestaoEnum from '../enum/TipoQuestaoEnum';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

export default function Alternativa(props) {
  const [questao, setQuestao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pesoString, setPesoString] = useState(["01", "02", "04", "08", "16"]);
  const [peso, setPeso] = useState([1, 2, 4, 8, 16]);
  const [opcoesAlternativas, setOpcoesAlternativas] = useState(["A) ","B) ","C) ","D) ","E) ","F) ","G) ","H) ","I) ","J) ","K) ","L) ","M) ","N) ","O) "]);
  const [opcaoMarcada, setOpcaoMarcada] = useState(null);

  useEffect(() => {
  }, [props]);

  // if (isLoading) {
  //   return <View><Text>Loading...</Text></View>
  // }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <ScrollView>
        {
          props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA ||
          props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA_PERCENTUAL
          ?
            <View>
              {
                props.alternativas.map((value, key) => {
                  return (
                    <View key={key}>
                      <RadioForm
                        radio_props={[{label: value.descricao, value: value.id }]}
                        initial={0}
                        onPress={(value) => {setOpcaoMarcada(value)}}
                      />
                    </View>
                  )
                })
              }
            </View>
          :
            <View>
              {
                props.alternativas.map((value, key) => {
                  return (
                    <View><Text>Somatória...</Text></View>
                  )
                })
              }
            </View>
        }
      </ScrollView>
    </SafeAreaView>
  )
}