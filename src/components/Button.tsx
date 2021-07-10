import React from 'react';
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { Entypo } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
}
// ...rest vem do TouchableOpacityProps, o qual traz props como onPress={}

export function Button({title, ...rest}: ButtonProps) {
    return (
        <TouchableOpacity 
            style={styles.container}
            {...rest} // ...rest deve sempre ser repassado por ultimo, como ultimo elemento aqui
        >
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.green,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.heading
    },
  
    // button: {
    //   backgroundColor: colors.green,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderRadius: 16,
    //   marginTop: 15,
    //   height: 56,
    //   width: 56,
    //   paddingHorizontal: 10,
    // },
  
    // buttonText: {
    //     color: colors.white,
    //     fontSize: 24,
    // }
  });
  