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
  const [alternativaSelecionadaId, setAlternativaSelecionadaId] = useState(null);
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

    await api
      .post(`respostaAlunoProva/saveAlternativa`, alternativaResposta)
      .then(res => {
        console.log('salvo com sucesso');
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    const getRespostaQuestao = async () => {
      await api
        .get(`respostaAlunoProva/${props.alunoId}/${props.aplicacaoProvaId}/${props.questaoId}`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            if (res.data[0].somatoria == null && res.data[0].resposta == null) {
              let alternativaSelecionadaId = res.data.map((rs) => {
                return rs.alternativaRespostaAlunoProva[0] ? rs.alternativaRespostaAlunoProva[0].alternativaQuestaoId : null;
              })
              setAlternativaSelecionadaId(alternativaSelecionadaId);
            } else if (res.data[0].somatoria != null) {
              //Somatória
            }
          }
        })
        .catch(err => console.log(err));
    }

    if (props.questaoId && props.alunoId && props.aplicacaoProvaId) {
      getRespostaQuestao();
    }
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
              setAlternativaSelecionadaId(opt.id);
              salvarAlternativaQuestao(idx);
            }}
            opcaoSelecionada={alternativaSelecionadaId}
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