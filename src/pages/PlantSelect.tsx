//interface de seleção das plantas
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../libs/storage';

//cabeçalho se repete em varios lugares, fazer componente: Header.tsx

interface EnviromentProps {
    key: string;
    title: string;
}

// interface PlantProps {
//     id: string,
//     name: string,
//     about: string,
//     water_tips: string,
//     photo: string,
//     environments: [string],
//     frequency: {
//       times: number,
//       repeat_every: string 
//     }
// }

export function PlantSelect(){
    const [ enviroments, setEnviroments ] = useState<EnviromentProps[]>([]);
    const [ plants, setPlants ] = useState<PlantProps[]>([]); //plants tem 'name' e 'photo' do plants do server
    const [ filteredPlants, setFilteredPlants ] = useState<PlantProps[]>([]); //plants tem 'name' e 'photo' do plants do server
    const [ enviromentSelected, setEnviromentSelected ] = useState('all'); //por padrão, botão 'todos' ficara selected
    const [ loading, setLoading ] = useState(true); //por padrão, vai estar carregando

    const [ page, setPage ] = useState(1);  //para paginação: em que momento da paginação o usuario esta
    const [ loadingMore, setLoadingMore ] = useState(false); //se ainda tem maisitens pra carregar

    const navigation = useNavigation();

    function handleEnviromentSelected(enviroment: string) { //la embaixo no botão, recebe param item.key como enviroment
        setEnviromentSelected(enviroment);

        if(enviroment === 'all') { //verificação, se clicado no estado inicial  definido 'all', vai trazer todos da api
            return setFilteredPlants(plants); //indicando todas as platas selecionadas
        }

        // renderizar plantas por ambiente selecionado
        const filtered = plants.filter(plant => //cuidado com {} chaves extras desnecessárias, não funcionarão
            plant.environments.includes(enviroment) //la na api, environments é um vetor
        )
        setFilteredPlants(filtered);
    }

    async function fetchPlants() {
        const { data } = await api.get(`plants?_sort=title&_order=asc&_page=${page}&_limit=8`); 

        if(!data) {             //validação: se não tem mais nada pra carregar, marcar estado como feito, true
            setLoading(true)  //loading = estado que define renderização da animação
        }

        if(page > 1) {
            setPlants(oldValue => [ ...oldValue, ...data]) // "junção dos dados que já existima com novos..." 
            setFilteredPlants(oldValue => [ ...oldValue, ...data])
            
        } else {   //se for apenas 1 pagina
            setPlants(data); //Componente PlantCardPrimary foi formatado pra puxar 'name' e 'photo' do plants
            setFilteredPlants(data); //caso ambiente nao tenha sido selecionado, i filter renderiza todos da api
            
        }      
        setLoading(false); //pra renderizar animação <Load />
        setLoadingMore(false); //pra carregar a proxima pagina, a partir do final da primeira pagina
      
    }

    function handleFetchMore(distance: number) { //quando user rolar tela até final(vertical) chamar mais dados

        if(distance < 1){ //1 representa 1 pagina
        return;
        } //else / caso contrario :
        setLoadingMore(true); 
        setPage(oldValue => oldValue + 1); //oldValue = pagina(s) anterior + proxima = será a 'page' renderizada
        fetchPlants();
    }

    //função ao clicar no botão, navegar pra page PlantSave
    function handlePlantSelect(plant: PlantProps) { //vai receber uma planta, com tipo PlantProps
        navigation.navigate('PlantSave', { plant }) //um 2º paramatro aqui passa tbm os dados da plant pra prox page
                                                    //e na page PlantSave, recupera dados com useRoute()
    }
    useEffect(() => {           //pra carregar os ambientes ('environments') na nossa tela com dados da api
        async function fetchEnviroment() {
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
            setEnviroments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ]);
        }
        fetchEnviroment();

    }, []);

    useEffect(() => {           //pra carregar nossa tela as plantas ('plants') com dados da api   
        fetchPlants();
    }, []);

    if(loading) {
        return <Load />
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />

                <Text style={styles.title}> 
                    Em qual ambiente
                </Text>

                <Text style={styles.subTitle}> 
                    voce quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList 
                    data={enviroments}
                    keyExtractor={(item) => String(item.key)} //prop pra tornar cada elemento UNICO - IMPORTANTE
                    renderItem={({ item }) => (
                        <EnviromentButton 
                            title={item.title}
                            active={item.key === enviromentSelected}
                            onPress={() => {handleEnviromentSelected(item.key)}} //selevionando qual ambiente
                            // active  //deixando apenas a prop active, ele simula como active
                        />

                    )}
                    horizontal //por padrão renderiza vertical
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList //FlatList renderiza lista de itens / PlantCardPrimary renderiza conteudo de cada item
                    // data={plants} //renderiza absolutamente todas platas de todos ambientes
                    data={filteredPlants} //renderiza plantas por ambiente selecionado e caso nao selecionado, todos
                    keyExtractor={(item) => String(item.id)} //prop pra tornar cada elemento UNICO - IMPORTANT
                    renderItem={({ item }) => (
                       <PlantCardPrimary //PlantCardPrimary instrui renderizar  'name ' e 'photo' do data={plants}
                        data={item}      
                        onPress={() => handlePlantSelect(item)} //tornando PrimaryCard em botão pra levar pra outra pagina                 
                       />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    contentContainerStyle={styles.contentContainerStyle}
                    onEndReachedThreshold={0.1}    //entrando nos ultimos 10%, vai disparar prop / function abaixo
                    onEndReached={({ distanceFromEnd }) => 
                        handleFetchMore(distanceFromEnd)
                    }
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green}/>
                        : <></>
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop:15,

    },
    subTitle:{
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.text,
        lineHeight: 20,
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32,
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
    contentContainerStyle: {

    }
})