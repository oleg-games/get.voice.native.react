import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '@components/TabBarIcon';
import ForMeAnswers from './ForMeAnswersStackNavigator'
import MyAnswers from './AnswersStackNavigator'

export default createBottomTabNavigator({
    MyAnswers: {
        screen: MyAnswers,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'My',
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name={
                        Platform.OS === 'ios'
                            ? `ios-information-circle${focused ? '' : '-outline'}`
                            :
                            'md-information-circle'
                    }
                />
            ),
        }),
    },
    ForMeAnswers: {
        screen: ForMeAnswers,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            tabBarLabel: 'For Me',
            tabBarIcon: ({ focused }) => (
                <TabBarIcon
                    focused={focused}
                    name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
                />
            ),
        }),
    },
},{
    // initialRouteName: 'ForMeAnswers',
});