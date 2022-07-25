import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, StatusBar, TextInput, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import TipoQuestaoEnum from '../enum/TipoQuestaoEnum';

export default function Discursiva(props) {
  const [resposta, setResposta] = useState('');

  const salvarAlternativaQuestao = async (respostaQuestao) => {
    let alternativaResposta = {
      questaoId: props.questaoId,
      alunoId: props.alunoId,
      aplicacaoProvaId: props.aplicacaoProvaId
    }

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_DISCURSIVA) {
      alternativaResposta = {
        ...alternativaResposta,
        resposta: respostaQuestao
      }
    }

    await api
      .post(`respostaAlunoProva/saveAlternativa`, alternativaResposta)
      .then(res => {
        registrarLog();
      })
      .catch(err => console.log(err));
  }

  const registrarLog = async (tipoQuestaoId = null) => {
    let tituloQuestao = null;
    let descricao = null;
    let navegador = `${Platform.OS} ${Platform.Version}`;

    if (props.tituloQuestao.length > 70) {
      tituloQuestao = props.tituloQuestao.substr(0, 70) + "...";
      tituloQuestao = await replaceCaracteres(tituloQuestao);
    } else {
      tituloQuestao = await replaceCaracteres(props.tituloQuestao);
    }
    
    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_DISCURSIVA) {
      descricao = `Respondeu a questão discursiva ${props.ordem} "${tituloQuestao}".`;
    }

    const log = {
      aplicacaoProvaId: props.aplicacaoProvaId,
      provaId: props.provaId,
      alunoId: props.alunoId,
      descricao,
      resposta,
      navegador,
      questaoId: props.questaoId,
      createdAt: new Date(),
    };

    await api.post('logRealizacaoProva', log);
  }

  const replaceCaracteres = async (string) => {
    string = string.replace(/<\/?[^>]+(>|$)/g, "");

    return string.replace(/&nbsp;/gi, "");
  }

  useEffect(() => {
    const getRespostaQuestao = async () => {
      await api
        .get(`respostaAlunoProva/${props.alunoId}/${props.aplicacaoProvaId}/${props.questaoId}`)
        .then(res => {
          let resposta = res.data.length > 0 ? res.data[0].resposta : null;
          setResposta(resposta);
        })
        .catch(err => console.log(err));
    }

    if (props.questaoId && props.alunoId && props.aplicacaoProvaId) {
      getRespostaQuestao();
    }
  }, [props]);

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      <TextInput
        multiline={true}
        numberOfLines={10}
        onChangeText={(value) => {
          setResposta(value);
          salvarAlternativaQuestao(value);
        }}
        value={resposta}
        style={{ height:200, textAlignVertical: 'top' }}
        placeholder="Resposta"
        editable={props.revisao}
        selectTextOnFocus={props.revisao}
      />
    </SafeAreaView>
  )
}