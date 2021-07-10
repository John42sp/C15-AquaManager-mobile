import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

import loadAnimation from '../assets/load.json';   //amimação 'Load' sera usada em varios locais = componente

export function Load() {
    return (
    <View style={styles.container}>
        <LottieView 
            source={loadAnimation}
            autoPlay //começar sozinho
            loop //reperir
            style={styles.animation}
        />
    </View>
        
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    animation: {
        backgroundColor: 'transparent', //pra não ter fundo
        width: 200,
        height: 200
    }
  

  });
  