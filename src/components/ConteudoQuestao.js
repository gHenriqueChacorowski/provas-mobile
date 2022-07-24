import React, { useEffect, useContext, useState, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, StatusBar, TextInput, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import RenderHtml from 'react-native-render-html';

export default function ConteudoQuestao(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [temaQuestao, setTemaQuestao] = useState({});
  let { width } = useWindowDimensions();

  useEffect(() => {
    const getTemasQuestao = async () => {
      await api
        .get(`temaQuestao/by/questao/${props.questaoId}`)
        .then(res => {
          setTemaQuestao(res.data[0].tema);
          setIsLoading(false);
        })
        .catch(err => console.log(err));
    }

    if (props.questaoId) {
      getTemasQuestao();
    }
  }, [props]);

  if (isLoading) {
    return <View><Text>Loading...</Text></View>
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', margin: 5, overflow: 'hidden' }}>
      {temaQuestao && <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1d1e1c' }}>{temaQuestao.nome}</Text>}
      <View style={{flexDirection: 'column', width: width - 85}}>
        {props.ordem && <Text style={{fontWeight: 'bold', fontSize: 16}}>{props.ordem}</Text>}
        <View style={{marginLeft: 5}}>
          {props.titulo && <RenderHtml source={{ html: props.titulo.replace('<p><br></p>', '') }} contentWidth={ width } />}
        </View>
      </View>
    </SafeAreaView>
  )
}