import React from 'react';
import GVComponent from '../../components/GVComponent';
import AsyncStorage from '@react-native-community/async-storage';
import { DeckSwiper, Container, Row, Grid, Header, Icon, Content, List, ListItem, Card, CardItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import Standart from '../../styles/standart';
import { Axios } from '../../http';

export default class MyAnswersScreen extends GVComponent {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      fontLoaded: false,
      items: []
    };
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    this.setState({ phoneNumber });
  };

  static navigationOptions = {
    title: 'My Answers',
  };

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const { data: items } = await Axios.get(`/answers/all/my`);
      this.setState({ items });
    } catch (err) {
      this._errorHandler(err)
    } finally {
      this._isLoading(false);
    }
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <DeckSwiper
          dataSource={this.state.items}
          renderItem={(item) =>
            <Card style={{ elevation: 3 }}>
              <CardItem>
                <Left style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Thumbnail
                    style={{ flex: 0.4 }}
                    source={{ uri: item.questionRef && item.questionRef.images && item.questionRef.images[0] || undefined }} />
                  <Body>
                    <Text>{item.questionRef && item.questionRef.text}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Left style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Thumbnail
                    style={{ flex: 0.4 }}
                    source={{ uri: item.images && item.images[0] || undefined }} />
                  <Body>
                    <Text>{item.text}</Text>
                    <Text note>From: {item.questionRef && item.questionRef.fromPhone}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          } />
      </Content>
    );
  }
}