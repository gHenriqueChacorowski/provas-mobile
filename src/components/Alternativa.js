import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions, TextInput, Platform } from 'react-native'
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

  const salvarAlternativaQuestao = async (index, somat = null, removeAlternativaSomat = null, altSelecionadaId = null, checkedSomatoria = null) => {
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
        registrarLog(altSelecionadaId, checkedSomatoria, somat);
      })
      .catch(err => console.log(err));
  }

  const checkBoxChecked = async (val, index) => {
    let data = alternativas;
    let som = somatoria;
    let removeAlternativaSomat = false;
    let checkedSomatoria = false;

    if (val.checked == true) {
      data[index].checked = false;
      som -= peso[index];
      removeAlternativaSomat = true;
    } else {
      data[index].checked = true;
      som += peso[index];
      removeAlternativaSomat = false;
      checkedSomatoria = true;
    }
    setSomatoria(som);
    setAlternativas(data);
    forceUpdate();

    salvarAlternativaQuestao(index, som, removeAlternativaSomat, val.id, checkedSomatoria);
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

  const registrarLog = async (altSelecionadaId = false, checkedSomatoria = false, somat = null) => {
    let tituloQuestao = null;
    let descricao = null;
    let somatoria = null;
    let alternativaQuestaoId = altSelecionadaId;
    let textoAlternativa = null;
    let navegador = `${Platform.OS} ${Platform.Version}`;

    if (props.tituloQuestao.length > 70) {
      tituloQuestao = props.tituloQuestao.substr(0, 70) + "...";
      tituloQuestao = await replaceCaracteres(tituloQuestao);
    } else {
      tituloQuestao = await replaceCaracteres(props.tituloQuestao);
    }
    
    if (altSelecionadaId) {
      textoAlternativa = await getTextoAlternativaById(
        altSelecionadaId
      );
      textoAlternativa = await replaceCaracteres(textoAlternativa, true);
    }
    
    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA) {
      descricao = `Respondeu a questão objetiva ${props.ordem} "${tituloQuestao}". Marcando a alternativa com o texto "${textoAlternativa}".`;
    }

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_MULTIPLA_ESCOLHA_PERCENTUAL) {
      descricao = `Respondeu a questão multipla escolha percentual ${props.ordem} "${tituloQuestao}". Marcando a alternativa com o texto "${textoAlternativa}".`;
    }

    if (props.tipoId == TipoQuestaoEnum.PERGUNTA_SOMATORIA) {
      if (checkedSomatoria) {
        descricao = `Respondeu a questão somatória ${props.ordem} "${tituloQuestao}". Marcando alternativa"${textoAlternativa}", com a soma total de "${somat}".`;
      } else {
        descricao = `Respondeu a questão somatória ${props.ordem} "${tituloQuestao}". Desmarcando alternativa"${textoAlternativa}", com a soma total de "${somat}".`;
      }
    }

    const log = {
      aplicacaoProvaId: props.aplicacaoProvaId,
      provaId: props.provaId,
      alunoId: props.alunoId,
      descricao,
      navegador,
      somatoria: somat,
      alternativaQuestaoId,
      questaoId: props.questaoId,
      createdAt: new Date(),
    };

    await api.post('logRealizacaoProva', log);
  }

  const getTextoAlternativaById = async (alternativaId) => {
    let textoAlternativa = null;
    textoAlternativa = alternativas.find((alt) => {
      return alt.id == alternativaId;
    });

    return textoAlternativa.descricao;
  }

  const replaceCaracteres = async (string, alternativa = false) => {
    if (!alternativa) {
      string = string.replace(/<\/?[^>]+(>|$)/g, "");
    } else {
      string = string.replace(/(<([^>]+)>)/gi, "");
    }

    return string.replace(/&nbsp;/gi, "");
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
              salvarAlternativaQuestao(idx, null, null, opt.id);
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