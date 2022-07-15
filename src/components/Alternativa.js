import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, TextInput } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import TipoQuestaoEnum from '../enum/TipoQuestaoEnum';
import Radio from './Radio';
import CheckBox from '@react-native-community/checkbox';
import RenderHtml from 'react-native-render-html';

export default function Alternativa(props) {
  const [questao, setQuestao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opcaoMarcada, setOpcaoMarcada] = useState(0);
  const [somatoria, setSomatoria] = useState(0);
  const peso = [1, 2, 4, 8, 16];
  const pesoString = ["01", "02", "04", "08", "16"];
  let { width } = useWindowDimensions();

  const salvarAlternativaQuestao = async (index) => {
    let alternativaResposta = {
      questaoId: props.questaoId,
      alunoId: props.alunoId,
      aplicacaoProvaId: props.aplicacaoProvaId
    }

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA || props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA_PERCENTUAL) {
      const textoAlternativa = props.alternativas.find((alt) => {
        return alt.id == props.alternativas[index].id
      })

      alternativaResposta = {
        ...alternativaResposta,
        alternativaQuestaoId: props.alternativas[index].id,
        textoAlternativa: textoAlternativa.descricao
      }
    }
    
    console.log(alternativaResposta);
    await api
      .post(`respostaAlunoProva/saveAlternativa`, alternativaResposta)
      .then(res => {
        console.log('salvo com sucesso');
      })
      .catch(err => console.log(err));
  }
  
  useEffect(() => {
  }, [props]);

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      {
        props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA ||
        props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA_PERCENTUAL
        ?
          <Radio
            opcoes={props.alternativas}
            onChangeOpcaoSelecionada={(opt, idx) => {
              setOpcaoMarcada(idx);
              salvarAlternativaQuestao(idx);
            }}
            opcaoSelecionada={opcaoMarcada}
          />
        :
          <View>
            {
              props.alternativas.map((value, key) => {
                let descricao = value.descricao.replace('<p><br></p>', '');
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: width - 95 }}>
                    <CheckBox />
                    <Text>{pesoString[key]})  </Text>
                    <RenderHtml source={{ html: descricao }} contentWidth={ width } />
                  </View>
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
      }
    </SafeAreaView>
  )
}