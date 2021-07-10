import React, { useEffect } from 'react';
import  Routes  from './src/routes';
import * as Notifications from 'expo-notifications';

import  AppLoading  from 'expo-app-loading'; //para segurar a tela de splash

import { 
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
  
} from '@expo-google-fonts/jost';
import { PlantProps } from './src/libs/storage';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  })
//criando listenner = uma função ouvindo quando uma notificaçao chega
  useEffect(() => {
      //  Notifications.setNotificationHandler({
      //   handleNotification: async () => ({
      //     shouldShowAlert: true,
      //     shouldPlaySound: false,
      //     shouldSetBadge: false,
      //   }),
      // });

    //ouvir evento, ver notificação chegar, no console (não funciona no console nem no iphone)
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {  //recuperando os dados da planta do paiload do notificationId do storage.ts
        const data = notification.request.content.data.plant as PlantProps;
        console.log(data);
      }
    )
      return () => subscription.remove(); 
    
    // async function notifications() {
    //   //PARA MOSTRAR NO CONSOLE TODAS NOTIFICAÇÕES AGENDADAS: (funciona)
    //   // const data = await Notifications.getAllScheduledNotificationsAsync();
    //   // console.log('###### SHOW ALL NOTIFIATIONS #####')
    //   // console.log(data);

    //   // PARA APAGAR TODAS NOTIFICAÇÕES AGENDADAS (funciona)
    //   // await Notifications.cancelAllScheduledNotificationsAsync();

    //   //  const data = await Notifications.getAllScheduledNotificationsAsync();
    //   // console.log('###### SHOW ALL NOTIFIATIONS #####')
    //   // console.log(data);
      
    // }
    // notifications();    
  },[])

//validação: fazer com que a tela de splash permaneça, e app renderize somente quando as fontes forem carregadas

  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (

    <Routes />

  );
}


