import React from 'react';
import { Image, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Contacts from 'react-native-contacts';
import { Textarea, Form, Grid, Icon, Row, Content, Button, Text, Label } from 'native-base';

import { Axios } from '../../http';

import GVComponent from '../../components/GVComponent';

import Standart from '../../styles/standart';
import StorageConst from '../../constants/Storage';

export default class AnswerScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      answerText: '',
      answer: undefined,
      text: '',
      value: 'aaaa',
      imgSource: undefined,
      fontLoaded: false,
      containsError: false,
      isLoadingImg: false,
    };
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && params.haveNotAnswer ? 'Get Answer' : 'Answer'
    };
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Form style={{ flex: 1 }}>
              <Label
                style={Standart.answerText}>
                {this.state.answer && this.state.answer.questionRef.text}
              </Label>
              <Label
                style={Standart.itemSubText}>
                From: {this.state.answer && this.state.answer.questionRef.fromPhone}
              </Label>
              <Textarea
                rowSpan={5}
                // style={!this.state.answer ? Standart.answerText : Standart.NONE}
                style={Standart.questionText}
                value={this.state.answerText}
                bordered
                placeholder="Answer"
                onChangeText={(answerText) => this.setState({ answerText })} />
              <Button
                iconLeft
                block
                light
                style={Standart.button}
                // style={!this.state.answer ? Standart.button : Standart.NONE}
                onPress={this._onAddImage}>
                <Icon name='add' />
                <Text> Add Image </Text>
              </Button>
              <Image
                source={{ uri: this.state.imgSource }}
                style={this.state.answer && this.state.answer.answerImage ? Standart.answerImage : Standart.NONE}
              />
              <Image
                source={{ uri: this.state.imgSource }}
                style={this.state.imgSource ? Standart.answerImage : Standart.NONE}
              />
              {/* <Image
                  source={!(this.state.answer && this.state.answer.id) ? { uri: this.state.imgSource } : { uri: this.state.answer.image}}
                  style={Standart.answerImage}
                /> */}
              <Image
                source={{ uri: this.state.answer && this.state.answer.questionRef.images && this.state.answer.questionRef.images[0] }}
                style={Standart.questionImage}
              />
            </Form>
          </Row>
          <Row style={Standart.buttonRow}>
            {/* <Row style={!(this.state.answer && this.state.answer.text) ? Standart.buttonRow : Standart.NONE}> */}
            <Button
              iconLeft
              block
              primary
              disabled={this.state.isLoadingImg}
              style={Standart.button}
              onPress={this._onGetAnswer}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Get answer </Text>
            </Button>
          </Row>
        </Grid>
      </Content>
    );
  }

  componentWillUnmount = async () => {
    await AsyncStorage.removeItem(StorageConst.ANSWER);
  }

  _loadParams = async () => {
    try {
      console.log('test1')
      this._isLoading(true);
      const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
      const answerId = await AsyncStorage.getItem(StorageConst.ANSWER);
      // //async to get answer info
      if (answerId) {
        console.log('answerId', answerId)
        const { data: answer } = await Axios.get(`/answers/${answerId}`);
        console.log('answer', answer)
        this.setState({ answer });
      }
      this.setState({ phoneNumber });
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  }

  _onGetAnswer = async () => {
    if (!this.state.answerText) {
      Alert.alert('Please fill answer text')
      return;
    }

    try {
      await this._showFirstContactAsync(this.state.url ? [this.state.url] : []);
    } catch (err) {
      this._errorHandler(err);
    }
  };

  async _showFirstContactAsync(images: string[]) {
    // Ask for permission to query contacts.
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.'
      }
    )

    Contacts.getAll(async (err, contacts) => {
      this._isLoading(true);
      if (err === 'denied') {
        throw new Error('Denied CONTACTS permissions!');
      } else {
        // contacts returned in Array
        console.log('contacts', contacts)
        try {
          if (contacts.length > 0) {
            const allContacts = contacts
              .reduce((all: string[], el: Contacts.Contact) =>
                el.phoneNumbers && el.phoneNumbers.length
                  ? all.concat(el.phoneNumbers.map((phoneNumber: any) => phoneNumber.number))
                  : all
                , [])
            // .map((el: any) => el.number);
            console.log('allContacts', allContacts)
            let data = { text: this.state.answerText, images, contacts: allContacts }

            // await Answers.updateAnswer(this.state.answer.id, data);
            console.log('data', data)
            await Axios.put(`/answers/${this.state.answer.id}`, data);
            console.log('Done')
          }
        } catch (err) {
          this._errorHandler(err);
        } finally {
          this.props.navigation.goBack();
        }
      }
      this._isLoading(false);
    })
  }

  _cleanAll = () => {
    this.setState({ answerText: '' })
  }

  _onAddImage = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
    // Display the camera to the user and wait for them to take a photo or to cancel
    // the action

    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(
      options, async (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          console.log('response', response.uri)
          this.setState({ imgSource: response.uri });
          this.setState({ isLoadingImg: true });

          try {
            const url = this.state.imgSource && await this._uploadImageAsync(this.state.imgSource);
            console.log('url', url)
            this.setState({ url });
          } catch (err) {
            console.log(err);
            this._errorHandler(err);
          } finally {
            this.setState({ isLoadingImg: false });
          }
        }
      });
  }
}
