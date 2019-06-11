import React from 'react';
import { StyleSheet } from 'react-native';
import { PRIMARY_STANDART_MARGIN } from './common';

const Standart = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    textInput: {
        padding: 0,
        margin: 0,
        flex: 1,
        fontSize: 20,
    },
    button: {
        fontSize: 18,
        margin: PRIMARY_STANDART_MARGIN,
    },
    buttonRow: {
        flex: 0.1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    listItemText: {
        fontSize: 14,
    },
    listItemSubText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    itemSubText: {
        fontSize: 14,
        fontWeight: "bold",
        margin: PRIMARY_STANDART_MARGIN,
    },
    answerText: {
        textAlign: 'left',
        fontSize: 18,
        margin: PRIMARY_STANDART_MARGIN,
    },
    questionText: {
        textAlign: 'left',
        fontSize: 18,
        margin: PRIMARY_STANDART_MARGIN,
    },
    questionImage: {
        flex: 0.5,
        margin: PRIMARY_STANDART_MARGIN,
        resizeMode: 'contain',
    },
    answerImage: {
        flex: 0.5,
        margin: PRIMARY_STANDART_MARGIN,
        resizeMode: 'contain',
    },
    NONE: {
        display: "none",
    }
});

export default Standart;