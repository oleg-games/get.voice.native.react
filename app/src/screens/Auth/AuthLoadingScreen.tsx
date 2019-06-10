import React from 'react';
// import AsyncStorage from '@react-native-community/async-storage';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import StorageConst from '../../constants/Storage';

export default class AuthLoadingScreen extends React.Component {
    constructor(props: any) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        console.log('authLoadingScreen')
        // const token = await AsyncStorage.getItem(StorageConst.TOKEN);
        // console.log('token', token)

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // const gVprops: any = this.props; 
        // gVprops.navigation.navigate(token ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}