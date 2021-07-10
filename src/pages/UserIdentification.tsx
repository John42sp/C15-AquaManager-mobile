import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserIdentification() {
    const [ isFocussed, setIsFocussed ] = useState(false);
    const [ isFilled, setIsFilled ] = useState(false);
    const [ name, setName ] = useState<string>();

    const navigation = useNavigation();

    function handleInputBlur() { //função quandousuário sai do campo input: 
        setIsFocussed(false);   //esta usando o input field
        setIsFilled(!!name);   //esvazia o input field, no caso o nome  recem preenchido apaga
    }

    function handleInputFocus() { //função quando user esta no input field
        setIsFocussed(true);
    }

    function handleInputChange(value: string) {
        setIsFilled(!!value);  //!! pra tornar uma string num valor boleano, verd ou false. se tem conteudo = true
        setName(value);
    }

    async function handleSubmit() {  //async / await pra garantir que não prossiga enquanto nome nao estiver salvo
        if(!name) {
            return Alert.alert('Campo obrigatório 😢')
        }
        try{
            await AsyncStorage.setItem('@plantmanager:user', name) 
            navigation.navigate('Confirmation', {  //desta tela userIdendification, instruipra qual tela ir, com infos
                title: 'Prontinho',
                subtitle: 'Agora vamos cuidar das suas plantinhas com muito cuidado.',
                buttonTitle: 'Começar',
                icon: 'smile',
                nextScreen: 'PlantSelect' //indo pra tela Confirmation, cominstrução qual é a prox tela ao clicar btn

            })

        } catch {
            return Alert.alert('Não foi possivel salvaro seu nome. 😢')

        }

    }
// KeyboardAvoidingView: pra form subir c/ teclado /TouchableWithoutFeedback pra fechar ao clicar em qalquer ponto, 
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
                <View style={styles.content}>
                    <View style={styles.form}>
                        <View style={styles.header}> 
                            <Text style={styles.emoji}>
                                
                                {isFilled ? '😃' : '😊'}
                            </Text>

                            <Text style={styles.title}>
                                Como podemos {'\n'} 
                                chamar voce?
                            </Text>   
                        </View>                 

                        <TextInput 
                            style={[
                                styles.input, //se input field clicad ou se preenchido, border permanece green
                                (isFocussed || isFilled) && { borderColor: colors.green }
                            ]} 
                            placeholder="Digite seu none"
                            onBlur={handleInputBlur} //controle quando user sai do text input
                            onFocus={handleInputFocus} //controle quando foco vai pro input
                            onChangeText={handleInputChange} //por padrão, onChangeText ja passa value como parametro
                        />
                        {/* para o botão funcionar, precisa fazer a tipagem dele, no componente botão */}
                        <View style={styles.footer}>
                            <Button  
                                title="Confirmar"
                                onPress={handleSubmit}
                            /> 
                        </View>

                    </View>

                    
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    content: {

        flex: 1,
        width: '100%',
    },
    form: {
        flex:1,
        justifyContent: "center", //top, center, bottom
        paddingHorizontal: 54,
        alignItems: 'center',  //left, center, bottom
        width: '100%'
    },

    header: {
        alignItems: 'center',
    },
    emoji: {
        fontSize: 44,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },

    footer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 20,
    },

})
