import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';
import colors from '../styles/colors';

import fonts from '../styles/fonts';

interface EnviromentButtonProps extends RectButtonProps {
    title: string;
    active?: boolean;   //? quer dizer o campo não é obrigatorio
}
    export function EnviromentButton({
        title,
        active = false,  //se não estiver clicado, padrão será falso
        ...rest          //pegar todas outras props do  botão
    }:EnviromentButtonProps ){

        return (
            <RectButton
                style={[
                    styles.container,
                    active && styles.containerActive //se ativo (clicado), estilo muda
                ]}
                {...rest}
            >
                <Text style={[
                    styles.text,
                    active && styles.textActive  //se ativo (clicado), estilo muda

                ]}>
                    { title }
                </Text>
            </RectButton>
        )
    }


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.shape,
        width: 76,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginRight: 5
    },
    containerActive: {
        fontFamily: fonts.heading,
        color: colors.green,
        backgroundColor: colors.green_light,
    },
    text: {
        color: colors.heading,
        fontFamily: fonts.text,
    },
    textActive: {
        color: colors.green_dark,
        fontFamily: fonts.heading,
    }

})