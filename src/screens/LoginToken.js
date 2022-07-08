import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/core";
import { Context, Provider } from "../context/authContext";
import api from '../services/api';

export default function LoginToken() {
  const { setIsLogged, setIsLoggedToken } = useContext(Context);

  const removeInfoState = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("lembrar");
  }

  useEffect(() => {
    const loginToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const lembrar = await AsyncStorage.getItem("lembrar");

      if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        if (lembrar == 'true') {
          setIsLogged(true);
          return;
        } else if (lembrar == 'false') {
          removeInfoState();
        }
      }

      setIsLogged(false);
      setIsLoggedToken(true);
    }
    
    loginToken();
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator color="black" size={40} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})