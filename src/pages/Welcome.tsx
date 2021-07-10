import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import wateringImg from '../assets/watering.png';
import colors from '../styles/colors';
import { Button } from '../components/Button';
import { Feather } from '@expo/vector-icons';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/core';



export function Welcome() {

  const navigation = useNavigation();

  function handleStart() {
    navigation.navigate('UserIdentification')
  }

  return (
    <SafeAreaView style={styles.container} >
      <View style={ styles.wrapper}>
        <Text style={styles.title}>
              Gerencie {'\n'} 
              suas plantas de {'\n'} 
              forma fácil
          </Text>

      
        <Image source={wateringImg} style={styles.image} resizeMode='contain' />

      
        <Text style={styles.subTitle}>Não esqueça mais de regar suas plantinhas.
              Nós cuidamos de lembrar voce sempre.
        </Text>   

        <TouchableOpacity 
              style={styles.button} 
              onPress={handleStart}
              activeOpacity={0.7}  //onpress={} vem do ...rest
              // {...rest}  //pegando o resto de todas props nativas do TouchableOpacityProps, inceridos pela interface
          >               
                <Feather name='chevron-right' style={styles.buttonIcon}/>          
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  wrapper: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', //ao invez de space-between, ele usou spacearound pra que nao colar nas bordas
    paddingHorizontal: 20,
    paddingTop: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.heading,
    marginTop: 0,
    marginBottom: 20,
    fontFamily: fonts.heading,
    lineHeight: 34,
  },

  subTitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.heading,
    marginTop: 15,
    fontFamily: fonts.text,
    lineHeight: 22
  },

  image: {       
    height: Dimensions.get('window').width * 0.7,  
    
},

    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 15,
        height: 56,
        width: 56,
    },

    buttonIcon: {
        color: colors.white,
        fontSize: 28,
    }

});
