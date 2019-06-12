import React from 'react';
import GVComponent from '../../components/GVComponent';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Row,
  Grid,
  Icon,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from 'native-base';
// At the top of your file
import Standart from '../../styles/standart';
import StorageConst from '../../constants/Storage';
import { Axios } from '../../http';

export default class MyQuestionsScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      token: '',
      items: [],
    };
    this._bootstrapAsync();
    // this will fire every time Page 1 receives navigation focus
    // this.props.navigation.addListener('willFocus', () => {
    //   console.log('willFocuse')
    // })
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
    const token = await AsyncStorage.getItem(StorageConst.TOKEN);
    this.setState({ phoneNumber, token });
  };

  static navigationOptions = {
    title: 'My Questions',
  };

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const { data: items } = await Axios.get(`/questions/all/my`);
      console.log('items', items)
      this.setState({ items });
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  };


  _showSelectedQuestion = async (question) => {
    const { navigate } = this.props.navigation;
    await AsyncStorage.setItem(StorageConst.QUESTION, question.id);
    navigate('MyQuestion', {
      id: question.id,
      // onGoBack: () => this._loadParams(),
    })
  };

  _showNewQuestion = async () => {
    const { navigate } = this.props.navigation;
    navigate('MyQuestion', {
      // onGoBack: () => this._loadParams(),
    });
  };

  _fillData = async () => {
    try {
      this._isLoading(true);
      await Axios.post(`/helper/fill`, {
        phone: this.state.phoneNumber,
      });
      this._isLoading(false);
      this._loadParams();
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  };

  _signOut = async () => {
    await Axios.post(`/security/signout`);
    await AsyncStorage.removeItem(StorageConst.TOKEN);
    const { navigate } = this.props.navigation;
    navigate('AuthLoading')
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Text>{this.state.phoneNumber}</Text>
            <Text>{this.state.token}</Text>
            <List
              dataArray={this.state.items}
              renderRow={(item) =>
                <ListItem thumbnail onPress={this._showSelectedQuestion.bind(this, item)}>
                  <Left>
                    <Thumbnail square
                      source={{ uri: item.images && item.images[0] || undefined }} />
                  </Left>
                  <Body>
                    <Text style={Standart.listItemText}>{item.text}</Text>
                  </Body>
                  <Right>
                  </Right>
                </ListItem>
              } />
          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._showNewQuestion}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Add Question </Text>
            </Button>
          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._fillData}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Fill DB </Text>
            </Button>
          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._signOut}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text> Log out </Text>
            </Button>
          </Row>
        </Grid>
      </Content>);
  };
}