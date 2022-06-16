import React, { useReducer } from 'react';
import createContext from './createContext';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

let initialState = {
  isLogged: false,
  isLoggedToken: false,
  loginError: null,
  senhaError: null,
  credentialsError: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case "loginError":
      return { ...state, loginError: action.payload }
      case "senhaError":
        return { ...state, senhaError: action.payload }
        case "credentialsError":
      return { ...state, credentialsError: action.payload }
    case "isLogged":
      return { ...state, isLogged: action.payload }
    case "isLoggedToken":
      return { ...state, isLoggedToken: action.payload }
    default:
      return state
  }
}

const setLoginError = (dispatch) => {
  return (message) => {
    dispatch({type: "loginError", payload: message})
  }
}

const setSenhaError = (dispatch) => {
  return (message) => {
    dispatch({type: "senhaError", payload: message})
  }
}

const setCredentialsError = (dispatch) => {
  return (message) => {
    dispatch({type: "credentialsError", payload: message})
  }
}

const setIsLogged = (dispatch) => {
  return (boolean) => {
    dispatch({type: "isLogged", payload: boolean})
  }
}

const setIsLoggedToken = (dispatch) => {
  return (boolean) => {
    dispatch({type: "isLoggedToken", payload: boolean})
  }
}

const logar = (dispatch) => {
  return async (login, senha, lembrar) => {
    try {
      await api
        .post("/login", { login, senha, redeSocial: null })
        .then(async res => {
          if (res.data.token) {
            dispatch({type: "credentialsError", payload: null})
  
            await AsyncStorage.setItem("token", res.data.token);
            await AsyncStorage.setItem("lembrar", JSON.stringify(lembrar));
            await AsyncStorage.setItem("usuario", JSON.stringify(res.data.usuario));

            dispatch({type: "isLogged", payload: true})
          }
        })
        .catch(err => {
          console.log(err);
          dispatch({type: "credentialsError", payload: "Credenciais informadas inválidas"})
        })
    } catch (err) {
      console.log(err);
      dispatch({type: "serverError", payload: "Servidor temporariamente indisponível."})
    }
  }
}

export const { Context, Provider } = createContext(
  reducer, 
  {setLoginError, setSenhaError, setCredentialsError, setIsLogged, setIsLoggedToken, logar}, 
  initialState
)