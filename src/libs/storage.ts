import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string; 
    },
    hour: string;
    dateTimeNotification: Date; //dateTimeNotification tbm esta no PlantSave.tsx
}

//interface para salvar plantas no storage, com is da planta, e perfil da planta como um objeto
export interface StoragePlantProps { //interface p/ salvar plants em formato de objeto. Pega a chave do objeto dinamicamente
    [id: string]: {
        data: PlantProps;
        notificationsId: string;
    }
}

//recebe param 'plant' + date in função handleSave() em PlantSave.tsx, para salvar novas plants
export async function savePlant(plant: PlantProps): Promise<void> {  //é uma promise, que nao vai devolver nada
    try {  //lidando com armazenamento, bom usar try / catch

        //AGENDAMENTO DE NOTIFICAÇÕES: AULA 5 - parte da função que vai disparar notificações pro usuario
        const nexTime = new Date(plant.dateTimeNotification);  //data/hora selecionada pelo usuario
        const now = new Date();  //hora/data atual

        const { times, repeat_every } = plant.frequency; 

        if(repeat_every === 'week') {  //plantas que a frequencia seja semanal
            const interval = Math.trunc(7 / times); //qual intervalo na semana entre regadas 
            nexTime.setDate(now.getDate() + interval) //setando quando é a proxima regada na semana
        } //nexTime = quando  é a prox notificação
        
        //comentar as 2 linhas abaixo pra simular chegada de nofificações no console (file App.tsx)
        // else //se frequencia for diaria
        //     nexTime.setDate(nexTime.getDate() + 1); //pra lembrar user no dia seguinte
            
           //quantos segundos do momento atual pra proxima regada (agendamento baseado em segundos)
            const seconds = Math.abs(   //abs = absoluto, pra não gerar negativo
                Math.ceil(now.getTime() - nexTime.getTime()) / 1000
            ); //diferença em segundos de um periodo pro outro

             Notifications.setNotificationHandler({
              handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
              }),
            });

            //quando agendamos notificação, devolve um id de notificação
            //deixar notificationsId salvo com dados da planta, e apagar notificações quando planta for removida
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Heeey, 🌿",
                    body: `Esta na hora de cuidar da sua ${plant.name}`,
                    sound: true,
                    // priority: Notifications.AndroidNotificationPriority.HIGH,
                    data: { 
                        plant //anexando um paiload à notificação = todos dados da planta
                    },
                }, //trigger: faltam quantos segundos pra proxima regada 
                trigger: { //quando faltar 60 seconds, vai disparar em 60 segundos, ou somente na propxima regada
                    seconds: seconds < 60 ? 60 : seconds,  //(ex.: seconds: 60 * 20,)  -> fara a cada 20 mints
                    repeats: true
                }
            })
            //termina aqui sobre agendamento notificações, coloca notificatioId abaixo no newPlant
        
      

        //FUNÇÃO VAI ARMAZENAR NO STORAGE AS PLANTAS JA SALVAS NO STORAGE, E SALVAR A NOVA SENDO SALVA ATUALMENTE
        const data = await AsyncStorage.getItem('@plantmanager:plants');//Async salva como texto, tornando de volta  {}
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {}; //poderia retornar undefined, então {}
        //oldPlants (StoragePlantProps) nada mais é do que plants(PlantProps) com id da plant
        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId //pra quando apagar planta, tbm cancelar notificações 
            }
        }

        await AsyncStorage.setItem('@plantmanager:plants', 
        JSON.stringify({
            ...newPlant, //juntar newPlant que acabeide criar com o que estava antes, com 'spread oparator' 
            ...oldPlants //garintido manter as que ja existiam coma nova criada, se nãova subscrever a antigasp nova
        })
        )

    } catch (error) {   //jogar o erro pra interface. Tratar do erro na outra tela
        throw new Error(error);
    }
}

//FUNÇÃO ACIMA SALVA NOVA PLANTA NO ASYNC STORAGE, FUNÇÃO ABAIXO FAZ CARREGAMENTO EM TELA PRO CLIENTE
//SIMULAÇÃO SE ASYNCSTORAGE ESTA ARMAZENANDO, FEX CONSOLE NP PLANTSAVE.TSX
// export async function loadPlant(): Promise<StoragePlantProps> {//  usou StoragePlantProps pq é o que recebe PLANTS
//     try {  
        
//         const data = await AsyncStorage.getItem('@plantmanager:plants');//Async salva como texto, tornando de volta  {}
//         const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}; //poderia retornar undefined, então {}

//         return plants;

//     } catch (error) {   //jogar o erro pra interface. Tratar do erro na outra tela
//         throw new Error(error);
//     }
// }

//LOADPLANT FUNCTION SERÁ USADA NA PAGE MYPLANTS.TSX
//apos simulação acima funcionar, criar função abaixo para fazer load de plantas no storage: 
export async function loadPlant(): Promise<PlantProps[]> { 
    try {  
        
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {}; 

        //SELECIONAR PLANTA POR CADA CHAVE QUE ESTIVER PERCORRENDO
        const plantsSorted = Object //transformar em Objeto
        .keys(plants)                  //percorrer cada chave dentro de plantas
        .map((plant) => {               //plant se torna a chave de cada planta, p/ retornar dados de cada uma planta
            return {
                ...plants[plant].data, //pegando todas plantas, selecionando pela chave e descarregando dados de cada
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm') //formatando a hora
            } //acrescentando hour a tudo o que já havia na planta
        })
        .sort((a, b) =>     //e percorrer item por item e colocar em sequencia qual tem menor distancia de agora 
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
        )

        return plantsSorted; //enfim, retorna lista de plantas organizada

    } catch (error) {   
        throw new Error(error);
    }
}

export async function removePlant(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    //CANCELAR NOTIFICAÇÕES AO APAGAR PLANTAS 
    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationsId);

    delete plants[id];//pega a planta em questão pelo id dela

    await AsyncStorage.setItem('@plantmanager:plants',
    JSON.stringify(plants)) //devolvendoo plants pro storage SEM o plant recem apagado
}