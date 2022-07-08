import React, { useContext, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSignOutAlt, faGraduationCap, faPhoneAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/core'
import { Context } from '../context/authContext'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function CustomDrawer(props) {
  const {setIsLogged, setIsLoggedToken, state} = useContext(Context);
  const navigation = useNavigation();

  const logOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("lembrar");
    await AsyncStorage.removeItem("usuario");

    setIsLogged(false);
    setIsLoggedToken(true);
  }

  return (
    <View style={stylesDrawer.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#E4E7EA' }}>
        <View style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}>
          <Image
            style={stylesDrawer.logoIntegrado}
            source={require('../assets/integradoLogo.png')}
          />
        </View>
        <View style={{ backgroundColor: "#1d1e1c", flexDirection: 'row' }}>
          <Image
            style={stylesDrawer.logoUser}
            source={require('../assets/profile.jpg')}
          />
          <TouchableOpacity>
            <Text style={stylesDrawer.textNameUser}>Henrique Chacorowski</Text>
          </TouchableOpacity>
        </View>

        <View style={stylesDrawer.hr} />

        <View style={{ backgroundColor: '#1d1e1c' }}>
          <Text style={stylesDrawer.titleItems}>Opções</Text>
          <View style={{ flexDirection: "row", marginBottom: 17 }}>
            <FontAwesomeIcon style={stylesDrawer.iconItem} icon={faSignOutAlt} />
            <Text style={stylesDrawer.textItem} onPress={() => logOut()}>Sair</Text>
          </View>

          <Text style={stylesDrawer.titleItems}>Provas</Text>
          <View style={{ flexDirection: "row", marginBottom: 17 }}>
            <FontAwesomeIcon style={stylesDrawer.iconItem} icon={faGraduationCap} />
            <Text style={stylesDrawer.textItem}>Alunos</Text>
          </View>
          
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <FontAwesomeIcon style={stylesDrawer.iconSubItem} icon={faArrowRight} />
            <Text style={stylesDrawer.textSubItem} onPress={() => navigation.navigate('VisualizarProva')}>Minhas Provas</Text>
          </View>

          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            <FontAwesomeIcon style={stylesDrawer.iconSubItem} icon={faArrowRight} />
            <Text style={stylesDrawer.textSubItem} onPress={() => navigation.navigate('RealizarProva')}>Realizar Provas</Text>
          </View>

          <Text style={stylesDrawer.titleItems}>Contato</Text>
          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <FontAwesomeIcon style={stylesDrawer.iconItem} icon={faPhoneAlt} />
            <Text style={stylesDrawer.textItem}>(44) 3518 2500</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <FontAwesomeIcon style={stylesDrawer.iconItem} icon={faPhoneAlt} />
            <Text style={stylesDrawer.textItem}>0800 042 0109</Text>
          </View>
        </View >
      </DrawerContentScrollView>
    </View>
  )
}

const stylesDrawer = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1e1c'
  },
  logoIntegrado: {
    height: 52, 
    width: "37%", 
    marginLeft: 15
  },
  logoUser: {
    height: 40, 
    width: "15%", 
    marginLeft: 10, 
    borderRadius: 100, 
    marginTop: 5, 
    marginBottom: 5
  },
  textNameUser: {
    color: "#E4E7EA", 
    flex: 1, 
    marginTop: 12, 
    marginLeft: 10, 
    fontSize: 18, 
    marginBottom: 10
  },
  hr: {
    borderBottomColor: 'black', 
    borderBottomWidth: 1
  },
  titleItems: {
    color: "#fff", 
    margin: 7, 
    backgroundColor: '#1d1e1c', 
    fontSize: 16, 
    marginBottom: 6
  },
  textItem: {
    color: "#fff", 
    marginLeft: 10, 
    fontSize: 17
  },
  textSubItem: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 15,
    marginTop: 0
  },
  iconItem: {
    color: "#fff", 
    marginLeft: 14, 
    marginTop: 4
  },
  iconSubItem: {
    color: "#fff", 
    marginLeft: 20,
    marginTop: 4
  }
});