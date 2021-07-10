import { Feather } from '@expo/vector-icons';
import getOverlappingDaysInIntervals from 'date-fns/getOverlappingDaysInIntervals';
import React from 'react';
import { Text, StyleSheet, View, Animated } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { color } from 'react-native-reanimated';
import { SvgFromUri } from 'react-native-svg';
import colors from '../styles/colors';

import fonts from '../styles/fonts';

interface PlantProps extends RectButtonProps {
    data: {
        name: string;
        photo: string;   
        hour: string;
    };
    handleRemove: () => void;
}

export function PlantCardSecondary({
        data,
        handleRemove,
        ...rest          //pegar todas outras props nativas do RectButtonProps
    }:PlantProps ){

        return (
            <Swipeable
                overshootRight={false}
                renderRightActions={() => (
                    <Animated.View>
                        <View>
                            <RectButton
                                style={styles.buttonRemove}
                                onPress={handleRemove}
                            >
                                <Feather name="trash" size={32} color={colors.white}     />
                            </RectButton>
                        </View>
                    </Animated.View>
                )}
            >
                <RectButton
                    style={styles.container}
                    {...rest}
                >
                    {/* <Image source={{ uri: data.photo}}/> */}
                <SvgFromUri 
                        uri={data.photo}
                        height={50}
                        width={50}
                    />
                    <Text style={styles.title} >
                        {data.name}
                    </Text>

                    <View style={styles.details}>
                        <Text style={styles.timeLable}> 
                            Regar às
                        </Text>
                        <Text style={styles.time}> 
                            {data.hour}
                        </Text>
                    </View>
                </RectButton>
            </Swipeable>
        )
    }


const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.shape,
        marginVertical: 5
    },


    title: {
        flex: 1,
        marginLeft: 10,
        fontFamily: fonts.heading,
        fontSize: 16,
        color: colors.heading
    },
    details: {
        alignItems: 'flex-end',
        marginRight: 10

    },
    timeLable: {
        fontSize: 16,
        fontFamily: fonts.text,
        color: colors.body_light
    },
    time: {
        marginTop: 0,
        fontSize: 16,
        fontFamily: fonts.heading,
        color: colors.body_dark
    },
    buttonRemove: {
        width: 90,
        height: '75%',
        backgroundColor: colors.red,
        marginVertical: '12%',        
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        position: 'relative',
        right: 10
    } 

})