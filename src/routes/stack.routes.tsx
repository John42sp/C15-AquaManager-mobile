import React from 'react';
import  { createStackNavigator } from '@react-navigation/stack';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';
import { MyPlants } from '../pages/MyPlants';

import colors from '../styles/colors';
import { PlantSelect } from '../pages/PlantSelect';
import AuthRoutes from './tabs.routes';
// import AuthRoutes from './tab.routes';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: colors.white
            },
        }}
    >
        <stackRoutes.Screen 
            name="Welcome"
            component={Welcome}
        />

        <stackRoutes.Screen 
            name="UserIdentification"
            component={UserIdentification}
        />

        <stackRoutes.Screen 
            name="Confirmation"
            component={Confirmation}
        />

        <stackRoutes.Screen //Confirmation pro PlantSelect, onde contem tabs no footer c/ acesso p MyPlants
            name="PlantSelect"
            // component={PlantSelect} //trocou de plantselect pra AuthRoutes (acesso a pagina por meiode tabs)
            component={AuthRoutes} 
        />

        <stackRoutes.Screen 
            name="PlantSave"
            component={PlantSave}
        />

        <stackRoutes.Screen 
            name="MyPlants"
            // component={MyPlants}
            component={AuthRoutes}
        />

    </stackRoutes.Navigator>
)


export default AppRoutes;