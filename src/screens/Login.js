import React, { Component, useState, useContext } from 'react';
import { Alert, Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Button, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import { Context } from "../context/authContext";
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from "../styles/index";

export default function Login({ navigation }) {
  const {setLoginError, setSenhaError, setCredentialsError, logar, state} = useContext(Context);

  const [login, setLogin] = useState(null);
  const [senha, setSenha] = useState(null);
  const [lembrar, setLembrar] = useState(false);

  const validar = (login, senha) => {
    let error = false;
    setLoginError(null);
    setSenhaError(null);
    setCredentialsError(null);

    if (login == null || login == '') {
      setLoginError("O campo Login é obrigatório.");
      error = true
    }
    if (senha == null || senha == '') {
      setSenhaError("O campo Senha é obrigatório.");
      error = true
    }

    return !error;
  }
  
  return (
    <TouchableWithoutFeedback touchSoundDisabled onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={styles.container}
      >
        <Image
          source={require('../assets/integradoLogo.png')}
        />

        <TextInput
          placeholder="Login"
          style={stylesLogin.input}
          onChangeText={
            text => {
              setLogin(text)
              setLoginError(null)
            }
          }
          value={login}
        />
        {state.loginError && <Text style={stylesLogin.fieldError}>{state.loginError}</Text>}

        <TextInput
          placeholder="Senha"
          style={stylesLogin.input}
          onChangeText={
            text => {
              setSenha(text)
              setSenhaError(null)
            }
          }
          value={senha}
          secureTextEntry={true}
        />
        {state.senhaError && <Text style={stylesLogin.fieldError}>{state.senhaError}</Text>}

        <View style={stylesLogin.containerCheckBox}>
          <CheckBox
            tintColors={{ true: "blue" }}
            disabled={false}
            value={lembrar}
            onValueChange={(newValue) => setLembrar(newValue)}
          />
          <Text style={{ flex: 1, marginTop: 5 }}>Lembrar minhas informações</Text>
        </View>

        {state.credentialsError && <Text style={stylesLogin.fieldError}>{state.credentialsError}</Text>}

        <TouchableOpacity
          style={stylesLogin.button}
          onPress={() => {
            if (validar(login, senha)) {
              logar(login, senha, lembrar, navigation);
            } else return
            setLogin("");
            setSenha("");
          }}
        >
          <Text
            style={stylesLogin.buttonText}
          >
            Acessar
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const stylesLogin = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    marginTop: 15,
    padding: 9,
    borderRadius: 3,
    fontSize: 16,
    backgroundColor: "#fff",
    borderWidth: 1
  },
  button: {
    marginTop: 15,
    borderRadius: 3,
    alignSelf: 'stretch',
    backgroundColor: "#356be8",
    color: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 41,
    color: "#fff",
  },
  fieldError: {
    color: "red",
    alignSelf: 'stretch',
  },
  containerCheckBox: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: -7
  }
});
