import React, { useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SvgFromUri } from 'react-native-svg'; 

import waterdrop from '../assets/waterdrop.png';


import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/core';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { isBefore, format } from 'date-fns';
import { PlantProps, savePlant } from '../libs/storage';




interface Params {
    plant: PlantProps    
}

//PlantSave recebe 'plant' vinda do PlantSelect pelo route.params + hora/data . 
//Chama a função 'handleSave() do storage.ts, onde realmente esta a função de registro de plantas c/ parametros 

export function PlantSave() { //aqui recebe qual é a planta, vinda do PlantSelect, storage.ts -> o que fazer c ela
    const [ selectedDateTime, setSelectedDateTime ] = useState(new Date()); //por padrão, será data/hora atual
    const [ showDatePicker, setShowDatePicker ] = useState(Platform.OS === 'ios')// padrão, pro ios ser true
                                                    //controlar quando ele vai aparecer, no caso do android
    const navigation = useNavigation();
    const route = useRoute();
    const { plant } = route.params as Params; //recuperando 'plant' do navigation.navigate do PlantSelect.tsx

    function handleChangeTime(event: Event, dateTime: Date | undefined) { //params: o que a função vai receber
        //dica pra saber params: 1º passar o mouse em cima do handleChangeTime la em baixo no onChange
        //embora o event não será usado aqui
        
        //validação sistema operacional
        if(Platform.OS === 'android') { 
            setShowDatePicker(oldState => !oldState); //inverter android para o oposto dele = ios
        }
        //validação se usuario selecionou data anterior a atual
        if(dateTime && isBefore(dateTime, new Date())){ //validação se dateTime(data recebida) é antes da atual
            setSelectedDateTime(new Date()); //vai setar pra data atual
            return Alert.alert('Escolha uma hora no futuro! 🤦‍♂️')
        }

        if(dateTime) {
            setSelectedDateTime(dateTime)
        }
    }

    function handleOpenDateTimePickerForAndroid(){
        setShowDatePicker(oldState => !oldState);  //pra inverter a logica(se ios, converter pra android)
    }

    async function handleSave() { //esta função é apenas disparada  do onPress, não precisa parametro

        // const data = await loadPlant(); //similação pra ver se carregamento da planta esta funcionando
        // console.log(data)

        try {
            await savePlant({  //função do storage.ts, recebe os 2 parametros plant + date, salva nova planta no storag
                ...plant,  //pegando a planta atual pra salvar
                dateTimeNotification: selectedDateTime //hora selecionada pelo usuario no spinner
            })
            navigation.navigate('Confirmation', {  //desta tela PlantSave, instrui pra qual tela ir, com infos
                title: 'Planta cadastrada!',
                subtitle: 'Fique tranquilo que sempre lembraremos voce de regrar sua plantinha.',
                buttonTitle: 'Muito obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants' //indo pra tela Confirmation, instruindo que prox é 'MyPlant' ao clicar btn
            })


        } catch {
            Alert.alert('Não foi possivel salvar! 🤦‍♂️')

        }
    }

    return (
        <>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri 
                        uri={plant.photo}
                        height={80}
                        width={80}                   
                    
                    />
                    <Text style={styles.plantName}>
                        {plant.name}
                    </Text>
                    <Text style={styles.plantAbout}>
                        {plant.about}
                    </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image 
                            source={waterdrop}
                            style={styles.tipImage}
                        />
                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>

                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>

                    {/* 2 CONDIÇÕES ABAIXO DEFINEM QUAL FORMATO DO AGENDAMENTO MORTAR: */}

                    {showDatePicker && (  //mostrar o DateTimePicker somente se for Ios
                        <DateTimePicker 
                        value={selectedDateTime} //deixar data horario selecionado como padrão
                        mode="time"
                        display="spinner"
                        onChange={handleChangeTime}
                        is24Hour={false}
                    />
                    )}

                    {Platform.OS === 'android' && ( //CASO android,condição pro botão aparecer somente no android
                        <TouchableOpacity 
                            style={styles.dateTimePickerButton}
                            onPress={handleOpenDateTimePickerForAndroid}
                        >
                            <Text style={styles.dateTimePickerText}>
                                {/* Mudar Horário */}
                                {`Mudar ${format(selectedDateTime,'HH:mm')}`}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View  style={styles.registerButton}>
                        <Button 
                            title="Cadastrar planta"
                            onPress={handleSave}                   
                        />
                    </View>
                

                </View>
            </View >
        </ScrollView>

        </>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape,
    },
    // scrollListContainer: {
    //     flexGrow: 1,
    //     justifyContent: 'space-between',
    //     backgroundColor: colors.shape
    //   },
    plantInfo: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape,
        minHeight: '40%'
    },
    controller: {
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20 //para android

    },
    plantName: {
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15,
    },
    plantAbout: {
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        marginTop: 10
    },
    tipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 40
    },
    tipImage: {
        width: 56,
        height: 56,
    },
    tipText: {
        flex: 1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 15,
        lineHeight: 17,
        textAlign: 'justify'
    },
    alertLabel: {
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 14,
        marginBottom: 5,
        marginTop: -10
    },
    dateTimePickerButton: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
    },
    dateTimePickerText: {
        color: colors.heading,
        fontSize: 24,
        fontFamily: fonts.text
    },
    registerButton: {
        position: 'relative',
        bottom: 20
    }

});