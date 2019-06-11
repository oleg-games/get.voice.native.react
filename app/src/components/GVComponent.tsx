import React from 'react';
import { View, YellowBox, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import { AppLoading, Font } from 'expo';
import { Container, Content, Spinner } from 'native-base';
// import { Ionicons } from '@expo/vector-icons';
import Standart from '../styles/standart';
import StorageConst from '../constants/Storage';
import { Axios } from '../http';
import SplashScreen from 'react-native-splash-screen'

export default class GVComponent extends React.Component {

    constructor(props: any) {
        super(props);

        this.state = {
            progress: 40,
            fontLoaded: false,
            loading: false,
            imgSource: undefined,
            uploading: false,
        };

        YellowBox.ignoreWarnings(['Setting a timer']);
    }

    async componentDidMount() {
        // try {
        //     await Font.loadAsync({
        //         'Roboto': require('native-base/Fonts/Roboto.ttf'),
        //         'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        //         ...Ionicons.font,
        //     });
        //     this.setState({ fontLoaded: true });
        // } catch (error) {
        //     console.log('error loading icon fonts', error);
        //     alert('error loading icon fonts', error);
        // }
        this._setDefaultState();

        // Set the AUTH token for any request
        // await AsyncStorage.removeItem(StorageConst.TOKEN);
        const token = await AsyncStorage.getItem(StorageConst.TOKEN);

        if (token) {
            console.log('token', token)
            Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        await this._loadParams();
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }

    _errorHandler(err, title = "Oops. Something when't wrong!") {
        if (err && err.response && err.response.data.error && err.response.data.error.message) {
            this._errorReqHandler(err);
        } else {
            Alert.alert(title, err.message);
        }
    }

    _errorReqHandler(err) {
        if (err.response.status === 401) {
            Alert.alert('Login problems!', err && err.response && err.response.data.error && err.response.data.error.message, [{
                text: 'OK',
                onPress: async () => {
                    await AsyncStorage.removeItem(StorageConst.TOKEN);
                    const { navigate } = this.props.navigation;
                    navigate('AuthLoading')
                }
            }]);
        } else {
            Alert.alert('Oops. Someting wrong!', err && err.response && err.response.data.error && err.response.data.error.message);
        }
    }

    _setDefaultState() {
        this.setState({ loading: true });
        this.setState({ uploading: false });
        this.setState({ progress: 0 });
    }

    render() {
        const { uploading, fontLoaded, loading, imgSource, progress } = this.state;
        // if (!fontLoaded) {
        //     return <AppLoading />;
        // }
        return (
            <Container>
                {imgSource !== '' && !!uploading && !!progress && (
                    <View>
                        <View
                            style={[styles.progressBar, { width: `${progress || 0}%` }]}
                        />
                    </View>
                )}
                {!!loading && (
                    this._renderLoader()
                )}
                {!loading && (
                    this._renderContent()
                )}
            </Container>);
    }

    _renderLoader() {
        return (
            <Content padder contentContainerStyle={Standart.container}>
                <Spinner style={{ flex: 1 }} color='blue' />
            </Content>
        );
    }

    _renderContent() {
        return null;
    }

    _isLoading(isLoading) {
        this.setState({ loading: isLoading });
    }

    _isUploading(isUploading) {
        this.setState({ uploading: isUploading });
    }

    _loadParams = async () => {
        this.setState({ loading: false });
    }

    formatAvatarData(uri) {
        const form = new FormData();
        form.append('uploadFile', {
            uri: uri,
            type: 'image/jpeg', // <-- this
            name: 'image.jpg',
        });
        return form;
    }

    /*
      Make the request to the POST /select-files URL
    */
    _uploadImageAsync = async (uri) => {
        console.log('uri', uri)
        this.setState({ uploading: true });
        this.setState({ imgSource: uri });
        this.setState({ progress: 1 });

        try {
            const { data } = await Axios.post('/storage/upload',
                this.formatAvatarData(uri),
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        console.log('loaded', progressEvent.loaded)
                        console.log('total', progressEvent.total)
                        const progress = (progressEvent.loaded / progressEvent.total) * 100;
                        console.log('progress', progress)
                        if (progress === 100) {
                            this.setState({ progress: 0 });
                        } else {
                            this.setState({ progress });
                        }
                    }
                },
            )
            console.log('data', data)
            return data && data.url;
        } catch (err) {
            console.log('err', err)
            this.setState({ progress: 0 });
            throw new Error(err);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    btn: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: 'rgb(3, 154, 229)',
        marginTop: 20,
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: 'rgba(3,155,229,0.5)'
    },
    btnTxt: {
        color: '#fff'
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200,
        resizeMode: 'contain',
        backgroundColor: '#ccc',
    },
    img: {
        flex: 1,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#ccc'
    },
    progressBar: {
        backgroundColor: 'rgb(3, 154, 229)',
        height: 3,
        shadowColor: '#000',
    }
});