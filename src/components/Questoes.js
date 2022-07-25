import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert} from 'react-native'
import api from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import Questao from './Questao';
import AsyncStorage from "@react-native-community/async-storage";
import AwesomeAlert from 'react-native-awesome-alerts';
import SweetAlert from 'react-native-sweet-alert';
import { useNavigation } from '@react-navigation/core'

export default function Questoes(props) {
  const [aplicacaoProva, setAplicacaoProva] = useState([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [questoes, setQuestoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [alert, setAlert] = useState(false);
  const [mensagemTitle, setMensagemTitle] = useState('');
  const [mensagemSubTitle, setMensagemSubTitle] = useState('f');
  const [usuario, setUsuario] = useState({});
  const navigation = useNavigation();

  const proximaQuestao = async () => {
    if (questaoAtual < questoes.length - 1) {
      let value = questaoAtual;
      value += 1;
      setQuestaoAtual(value);
    }
  }

  const voltarQuestao = async () => {
    if (questaoAtual > 0) {
      let value = questaoAtual;
      value -= 1;
      setQuestaoAtual(value);
    }
  }

  const finalizarProva = async () => {
    let mensagemTitle = "";
    let mensagemSubTitle = "";

    let respostas = await api.get(`respostaAlunoProva/resposta/alunoIdAndAplicacaoProvaId/${props.aplicacaoProvaId}/${usuario.id}`).then(res => res.data);

    let liberado = true;
    if (respostas.length < questoes.length) liberado = false;

    if (!liberado) {
      mensagemTitle = "Atenção! Você não respondeu todas as questões";
      mensagemSubTitle = "Deseja finalizar a prova assim mesmo?";
    } else {
      mensagemTitle = "Deseja finalizar a prova?";
      mensagemSubTitle = "Após a confirmação você nao terá mais acesso a prova.";
    }

    setMensagemTitle(mensagemTitle);
    setMensagemSubTitle(mensagemSubTitle);
    setAlert(true);
  }

  const registrarLog = async (estadoRealizacao, infoProva = null) => {
    let descricao = null;
    let inicioOrFim = estadoRealizacao ? "Iniciou" : "Finalizou";
    let navegador = `${Platform.OS} ${Platform.Version}`;

    if (estadoRealizacao == false || estadoRealizacao == true) descricao = `${inicioOrFim} a aplicação de prova "${infoProva.descricao}".`;

    const log = {
      aplicacaoProvaId: infoProva.aplicacaoProvaId,
      provaId: infoProva.provaId,
      alunoId: infoProva.alunoId,
      descricao,
      navegador,
      createdAt: new Date()
    };

    await api.post('logRealizacaoProva', log);
  }

  const hideAlert = async () => {
    setAlert(false);
  };

  const showMessageProvaFinalizada = async () => {
    SweetAlert.showAlertWithOptions({
      title: 'Pronto!',
      subTitle: 'Sua prova foi salva e finalizada',
      confirmButtonTitle: 'OK',
      confirmButtonColor: '#000',
      style: 'success',
      cancellable: true
    })
  }

  useEffect(() => {
    const questoesIds = async (provaId, aplicacaoProvaId, descricao) => {
      const usuario = await AsyncStorage.getItem("usuario").then(res => JSON.parse(res));
      setUsuario(usuario);

      let infoProva = {
        provaId,
        aplicacaoProvaId,
        descricao,
        alunoId: usuario.id
      }
      await api
        .get(`questaoProva/by/provaId/aplicacaoProvaId/alunoId/${provaId}/${aplicacaoProvaId}/${usuario.id}`)
        .then(res => {
          setQuestoes(res.data);
          setIsLoading(false);
          registrarLog(true, infoProva);
        });
    }
    const getInfoAplicacaoProva = async () => {
      await api
        .get(`prova/aplicacaoProva/${props.aplicacaoProvaId}`)
        .then(res => {
          setAplicacaoProva(res.data.aplicacaoProvas[0]);
          questoesIds(res.data.aplicacaoProvas[0].provaId, res.data.aplicacaoProvas[0].id, res.data.aplicacaoProvas[0].descricao);
        })
        .catch(err => console.log(err));
    }

    if (props.aplicacaoProvaId) {
      getInfoAplicacaoProva();
    }
  }, [props.aplicacaoProvaId]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#D8DBDE' }}>
      <ScrollView>
        <View style={{ paddingTop: 70, paddingLeft: 10, paddingRight: 20, paddingBottom: 175 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#1d1e1c', marginBottom: 15 }}>Questoes</Text>
          <Questao provaId={aplicacaoProva.provaId} aplicacaoProvaId={aplicacaoProva.id} questaoId={questoes[questaoAtual].questaoId} questaoAtual={questaoAtual + 1} />
        </View>
      </ScrollView>
      <View style={styles.headerbarBottomQuestoes}>
        <View style={styles.headerBottomItens}>
          <View>
            {
              questaoAtual > 0 &&
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    voltarQuestao();
                  }}
                >
                  <Text style={styles.btnDefault}>
                    <FontAwesomeIcon style={styles.iconLeft} icon={faChevronLeft} size={ 11 } />&nbsp; Anterior
                  </Text>
                </TouchableOpacity>
              </View>
            }
          </View>
          {
            (questaoAtual + 1) < questoes.length
            ?
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    proximaQuestao();
                  }}
                >     
                  <Text style={styles.btnPrimary}>
                    Próximo &nbsp;<FontAwesomeIcon style={styles.iconRight} icon={faChevronRight} size={ 11 } />
                  </Text>
                </TouchableOpacity>
              </View>
            :
              <View
                style={styles.navButton}
              >
                <TouchableOpacity
                  onPress={() => {
                    finalizarProva();
                  }}
                >     
                  <Text style={styles.btnPrimary}>
                    Finalizar Prova
                  </Text>
                </TouchableOpacity>
              </View>
          }
        </View>
      </View>
      <AwesomeAlert
        show={alert}
        showProgress={false}
        title={mensagemTitle}
        message={mensagemSubTitle}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Sim"
        confirmText="Não! Ainda não"
        confirmButtonColor="#d33"
        cancelButtonColor="#3085d6"
        onCancelPressed={async () => {
          hideAlert();
          const alunoProvaInfo = {
            aplicacaoProvaId: aplicacaoProva.id,
            alunoId: usuario.id,
            provaFinalizada: new Date()
          }

          await api
            .post("alunoProva/finalizarAlunoProva", alunoProvaInfo)
            .then(res => {
              let infoProva = {
                provaId: aplicacaoProva.provaId,
                aplicacaoProvaId: aplicacaoProva.id,
                descricao: aplicacaoProva.descricao,
                alunoId: usuario.id
              }
              registrarLog(false, infoProva);

              showMessageProvaFinalizada();
              navigation.navigate('RealizarProva', { reloadPage: true })
            })
            .catch(err => {
              Alert('Erro ao tentar finalizar a prova!!');
              console.log(err);
            })       
        }}
        onConfirmPressed={() => {
          hideAlert();
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  headerbarBottomQuestoes: {
    flexDirection: 'row',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    top: 'auto',
    zIndex: 999
  },
  headerBottomItens: {
    borderLeftColor: '#eee',
    borderLeftWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  btnDefault: {
    backgroundColor: '#e4e7ea',
    borderRadius: 3,
    color: '#636e7b',
    paddingTop: 6,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 6,
    fontSize: 16   
  },
  btnPrimary: {
    backgroundColor: '#356be8',
    borderRadius: 3,
    color: '#fff',
    paddingTop: 6,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 6,
    fontSize: 16,  
  },
  navButton: {
    paddingTop: 7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 7
  },
  iconRight: {
    color: "#fff"
  },
  iconLeft: {
    color: "#636e7b"
  },
});