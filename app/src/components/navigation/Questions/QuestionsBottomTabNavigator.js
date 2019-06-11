import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '@components/TabBarIcon';
import ForMeQuestions from './ForMeQuestionsStackNavigator'
import Questions from './MyQuestionsStackNavigator'

export default createBottomTabNavigator({
    MyQuestions: {
        screen: Questions,
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
    ForMeQuestions: {
        screen: ForMeQuestions,
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
    // initialRouteName: 'ForMeQuestions',
});