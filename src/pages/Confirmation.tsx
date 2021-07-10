import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/Button';
import { useNavigation, useRoute } from '@react-navigation/core';
//COMPONENTE CONFIRMAÇÃO USADO PRA CONFIRMAR REGISTRO USUARIO E CADASTRO DE NOVA PLANTA. 
//RECEBE VARIAVEIS QUE SÃO INSTRUIDAS NA USERIDENTIFICATION E PLANTSAVE, E INSTRUI PROX PAGE NA VAR NEXTPAGE


interface Params {  //interface criada para confirmação do cadastro de novas plantas
    title: string;
    subtitle: string;
    buttonTitle: string;
    icon: 'smile' | 'hug';
    nextScreen: string;
}

const emojis = {
    hug: '😎',
    smile: '😁', 
}


export function Confirmation() {
    const navigation = useNavigation();

    const routes = useRoute();

    const {
        title,
        subtitle,
        buttonTitle,
        icon,
        nextScreen
    } = routes.params as Params;

    function handleMoveOn(){
        navigation.navigate(nextScreen) //
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
                <View style={styles.content}>                   
                    
                    <Text style={styles.emoji}>
                        {emojis[icon]}
                    </Text>

                    <Text style={styles.title}>
                        {title}
                    </Text>

                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>      

                    <View style={styles.footer}>
                        <Button 
                            title={buttonTitle}
                            onPress={handleMoveOn}
                        />
                    </View>                             
                    
                </View>

                
            {/* </KeyboardAvoidingView> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 30,
    },
    content: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },

    emoji: {
        fontSize: 78,
    },

    title: {
        fontSize: 22,
        lineHeight: 38,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 15
    },

    subtitle: {
        fontSize: 17,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.text,
        paddingVertical: 10,
    },

    footer: {
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 20,
    },

})
