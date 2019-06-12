import React from 'react';
import GVComponent from '../../components/GVComponent';
import AsyncStorage from '@react-native-community/async-storage';
import { Row, Grid, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
// At the top of your file
import Standart from '../../styles/standart';
import StorageConst from '../../constants/Storage';
import { Axios } from '../../http';

export default class ForMeQuestionsScreen extends GVComponent {

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
    title: 'For me Questions',
  };

  _loadParams = async () => {
    try {
      this._isLoading(true);
      const { data: items } = await Axios.get(`/answers/all/empty/my`);
      this.setState({ items });
    } catch (err) {
      this._errorHandler(err);
    } finally {
      this._isLoading(false);
    }
  };

  _showQuestionForMe = async (answer) => {
    console.log(answer)
    const { navigate } = this.props.navigation;
    await AsyncStorage.setItem(StorageConst.ANSWER, answer.id);
    navigate('ForMeQuestion', {
      haveNotAnswer: true,
    })
  };

  _renderContent() {
    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <List
              dataArray={this.state.items}
              renderRow={(item) =>
                <ListItem thumbnail onPress={this._showQuestionForMe.bind(this, item)}>
                  <Left>
                    <Thumbnail square source={{ uri: item.questionRef && item.questionRef.images && item.questionRef.images[0] }} />
                  </Left>
                  <Body>
                    <Text style={Standart.listItemText}>{item.questionRef && item.questionRef.text}</Text>
                    <Text style={Standart.listItemSubText}>From: {item.questionRef && item.questionRef.fromPhone}</Text>
                  </Body>
                </ListItem>
              } />
          </Row>
        </Grid>
      </Content>
    );
  }
}