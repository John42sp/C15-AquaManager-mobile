import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { FlatList } from 'react-native-gesture-handler';
import { PlantProps, loadPlant, StoragePlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import AsyncStorage from '@react-native-async-storage/async-storage';



export function MyPlants() {
    const [ myPlants, setMyPlants ] = useState<PlantProps[]>([]);
    const [ loading, setLoading ] = useState(true); //apenas pra simular carregamento
    const [ nextWatered, setNextWatered ] = useState<string>(); //apenas pra simular carregamento

    function deletePlant(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não 🤔',
                style: 'cancel'
            },
            {
                text: 'Sim 😉',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        //CODIGO ABAIXO ENVIADO PRO STORAGE.TS - REFATORADO, CHAMANDO FUNÇÃO ACIMA AO INVES
                        // const data = await AsyncStorage.getItem('@plantmanager:plants');
                        // const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

                        // delete plants[plant.id];//pega a planta em questão pelo id dela

                        // await AsyncStorage.setItem('@plantmanager:plants',
                        // JSON.stringify(plants)) //devolvendoo plants pro storage SEM o plant recem apagado

                        setMyPlants((oldData) => ( //setando de volta no myPlants todas plants exceto recem apagada
                            oldData.filter((item) => item.id !== plant.id)
                        ))


                    } catch (error) {
                        Alert.alert('Não foi possivel remover!')

                    }
                }
            }
        ])

    }

    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant(); //PEGANDO LISTA DE PLANTAS ARMAZENADAS NO STORAGE
        
            const nextTime = formatDistance(    //formDistance calcula pra gente distancia de uma data p/ outra
                new Date(plantsStoraged[0].dateTimeNotification).getTime(), //pegando 1ª posição da data mais proxima
                new Date().getTime(), //pra data atual
                { locale: pt }
            );
            setNextWatered( //setar quando a planta deve ser regada
                //pegando a 1ª posição, a proxima a ser regada
                `Não esqueça de regar a ${plantsStoraged[0].name} às ${nextTime}.`  
            )
            setMyPlants(plantsStoraged); //carregar as plantas
            // setLoading(false); //parar o carregamento
        }
        loadStorageData();
    }, [])

    if(loading)  //nao funciona animação de carregamento aqui
        <Load />
    

    return (
        <>
  
            <View style={styles.container}>
                <Header />

                <View style={styles.spotlight}>
                    <Image 
                        source={waterdrop}
                        style={styles.spotlightImage}
                    />
                    <Text style={styles.spotlightText}>
                        {nextWatered}
                    </Text>

                </View>

                <View style={styles.plants}>
                    <Text style={styles.plantTitle}>
                        Proximas regadas
                    </Text>

                    <FlatList 
                        data={myPlants}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <PlantCardSecondary 
                                data={item}
                                handleRemove={() => deletePlant(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flex: 1 }} //pra ocupar toda tela
                    />
                    
                </View>

            </View>
       
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },
    schrollContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    spotlightImage: {
        height: 45,
        width: 45

    },
    spotlightText: {
        flex:1,
        color: colors.blue,
        paddingHorizontal: 20,
        // textAlign: 'justify'
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})