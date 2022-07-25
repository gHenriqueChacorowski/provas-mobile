import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, TextInput } from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import TipoQuestaoEnum from '../enum/TipoQuestaoEnum';
import Radio from './Radio';
import CheckBoxComponent from './CheckBoxComponent';

export default function Alternativa(props) {
  const [somatoria, setSomatoria] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [alternativaSelecionadaId, setAlternativaSelecionadaId] = useState(null);
  const [alternativas, setAlternativas] = useState({});
  const peso = [1, 2, 4, 8, 16];
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  let alternativasMarcadas = [];

  const salvarAlternativaQuestao = async (index, somat = false, removeAlternativaSomat = false) => {
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

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_SOMATORIA) {
      const textoAlternativa = alternativas.find((alt) => {
        return alt.id == alternativas[index].id;
      })

      alternativaResposta = {
        ...alternativaResposta,
        alternativaQuestaoId: alternativas[index].id,
        textoAlternativa: textoAlternativa.descricao,
        somatoria: somat,
        removeAlternativaSomatoria: removeAlternativaSomat
      }
    }

    await api
      .post(`respostaAlunoProva/saveAlternativa`, alternativaResposta)
      .then(res => {
        console.log('salvo');
      })
      .catch(err => console.log(err));
  }

  const checkBoxChecked = async (val, index) => {
    let data = alternativas;
    let som = somatoria;
    let removeAlternativaSomat = false;

    if (val.checked == true) {
      data[index].checked = false;
      som -= peso[index];
      removeAlternativaSomat = true;
    } else {
      data[index].checked = true;
      som += peso[index];
      removeAlternativaSomat = false;
    }
    setSomatoria(som);
    setAlternativas(data);
    forceUpdate();

    salvarAlternativaQuestao(index, som, removeAlternativaSomat);
  }

  const getAlternativasQuestao = async () => {
    await api
      .get(`alternativaQuestao/by/questao/${props.questaoId}`)
      .then(res => {
        let som = 0;
        for (const alternativa of res.data) {
          if (alternativasMarcadas.includes(alternativa.id)) {
            som += alternativa.somatoria;
          }
        }
        setSomatoria(som);
        forceUpdate();
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
              if (alternativas && alternativas.length !== undefined) {
                let alt = alternativas;
                for (const alternativa of res.data[0].alternativaRespostaAlunoProva) {
                  alt.map((a) => {
                    if (a.id == alternativa.alternativaQuestaoId) {
                      a.checked = true;
                      alternativasMarcadas.push(a.id);
                    }
                  })
                }
                setAlternativas(alt);
                forceUpdate();

                getAlternativasQuestao();
              }
            }
          }
        })
        .catch(err => console.log(err));
    }

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_SOMATORIA) {
      setSomatoria(0);
    }
    if (props.questaoId && props.alunoId && props.aplicacaoProvaId) {
      getRespostaQuestao();
    }

    if (props.alternativas) {
      setAlternativas(props.alternativas);
      setIsLoading(false);
    }
  }, [props]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF' }}>
      {
        props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA ||
        props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA_PERCENTUAL
        ?
          <Radio
            opcoes={alternativas}
            onChangeOpcaoSelecionada={(opt, idx) => {
              setAlternativaSelecionadaId(opt.id);
              salvarAlternativaQuestao(idx);
            }}
            opcaoSelecionada={alternativaSelecionadaId}
            disabled={props.revisao ? props.revisao : false}
          />
        :
          <CheckBoxComponent
            opcoes={alternativas}
            onChangeCheckBox={(val, idx) => {
              checkBoxChecked(val, idx);
            }}
            somatoria={somatoria}
            disabled={props.revisao ? props.revisao : false}
          />
      }
    </SafeAreaView>
  )
}