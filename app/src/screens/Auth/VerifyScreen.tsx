import React from 'react';
import GVComponent from '../../components/GVComponent';

import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  Alert,
} from 'react-native';

import {
  Row,
  Grid,
  Icon,
  Content,
  Text,
  Button,
} from 'native-base';
import { PRIMARY_STANDART_MARGIN } from '../../styles/common';
import AsyncStorage from '@react-native-community/async-storage';

import Form from 'react-native-form';
import StorageConst from '../../constants/Storage';
import CountryPicker from 'react-native-country-picker-modal';
// import { parsePhoneNumberFromString, parsePhoneNumber, ParseError } from 'libphonenumber-js'
// import { parsePhoneNumberFromString as parseMobile } from 'libphonenumber-js/mobile'
// import { formatIncompletePhoneNumber, AsYouType } from 'libphonenumber-js'
// import googleLib from 'google-libphonenumber';
// import phoneFormatter from 'phone';
// import PhoneNumberA from 'awesome-phonenumber';
import Standart from '../../styles/standart';

// import Form from 'react-native-form';
// import CountryPicker from 'react-native-country-picker-modal';
import { Axios } from '../../http';

// const captchaUrl = `https://get-voice-4d167.firebaseapp.com/?appurl=${Linking.makeUrl('')}`

const MAX_LENGTH_CODE = 5;
const MAX_LENGTH_NUMBER = 20;

// if you want to customize the country picker
const countryPickerCustomStyles = {};

// your brand's theme primary color
const brandColor = '#744BAC';

const styles = StyleSheet.create({
  countryPicker: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1
  },
  header: {
    flex: 0.1,
    margin: PRIMARY_STANDART_MARGIN,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: PRIMARY_STANDART_MARGIN,
  },
  textInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    // fontSize: 20,
    // color: brandColor
  },
  button: {
    marginTop: 20,
    height: 50,
    // backgroundColor: brandColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonText: {
    // color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  wrongNumberText: {
    margin: 10,
    fontSize: 14,
    textAlign: 'center'
  },
  disclaimerText: {
    marginTop: 30,
    fontSize: 12,
    color: 'grey'
  },
  callingCodeView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  callingCodeText: {
    // fontSize: 20,
    // color: brandColor,
    // fontWeight: 'bold',
    paddingRight: 20
  }
});

export default class Verify extends GVComponent {

  constructor(props: any) {
    super(props);
    this.state = {
      phone: '',
      confirmationResult: undefined,
      //       code: ''
      enterCode: false,
      country: {
        cca2: 'RU',
        callingCode: '7'
      }
    };
  }

  reset = () => {
    this.setState({
      phone: '',
      phoneCompleted: false,
      confirmationResult: undefined,
      code: ''
    })
  }

  _getCode = async () => {
    const { phoneNumber } = this.refs.form.getValues();
    const { country } = this.state;

    try {
      if (!phoneNumber) {
        throw new Error('Please fill phone')
      }

      this.setState({ loading: true, phone: `${country.callingCode}${phoneNumber}` });
      const { data } = await Axios.post('/security/code', { phone: `${country.callingCode}${phoneNumber}` });
      setTimeout(() => {
        Alert.alert('Sent!', `We've sent you a verification code ${data.code}`, [{
          text: 'OK',
          onPress: () => this.refs.form.refs.textInput.focus()
        }]);
      }, 100);
      this.setState({
        loading: false,
        enterCode: true,
      });
    } catch (err) {
      this._errorHandler(err)
    } finally {
      this.setState({ loading: false });
    }
  }

  _verifyCode = async () => {
    this.setState({ loading: true });
    try {
      const { code } = this.refs.form.getValues();
      console.log(this.state.phone, code)
      const { headers, data } = await Axios.post('/security/verify', { phone: this.state.phone, code });
      console.log('token', headers.token)

      await AsyncStorage.setItem(StorageConst.PHONE_NUMBER, data && data.user && data.user.phone);
      await AsyncStorage.setItem(StorageConst.TOKEN, headers && headers.token);

      this.reset()
      Alert.alert('Success!', 'You have successfully verified your phone number');
      this.setState({ loading: false });
      this.props.navigation.navigate('App');
    } catch (err) {
      this.setState({ loading: false });
      this._errorHandler(err)
    }
  }

  _onChangeText = (val) => {
    if (!this.state.enterCode) return;
    if (val.length === MAX_LENGTH_CODE)
      this._verifyCode();
  }

  _tryAgain = () => {
    this.refs.form.refs.textInput.setNativeProps({ text: '' })
    this.refs.form.refs.textInput.focus();
    this.setState({ enterCode: false });
  }

  _getSubmitAction = () => {
    this.state.enterCode ? this._verifyCode() : this._getCode();
  }

  _getValidPhoneNumber() {

  }

  _changeCountry = (country) => {
    this.setState({ country });
    this.refs.form.refs.textInput.focus();
  }

  _renderFooter = () => {

    if (this.state.enterCode)
      return (
        <View>
          <Text style={styles.wrongNumberText} onPress={this._tryAgain}>
            Enter the wrong number or need a new code?
          </Text>
        </View>
      );

    return (
      <View>
        <Text style={styles.disclaimerText}>By tapping "Send confirmation code" above, we will send you an SMS to confirm your phone number. Message &amp; data rates may apply.</Text>
      </View>
    );

  }

  _renderCountryPicker = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <CountryPicker
        ref={'countryPicker'}
        closeable
        style={styles.countryPicker}
        onChange={this._changeCountry}
        cca2={this.state.country.cca2}
        styles={countryPickerCustomStyles}
        translation='eng' />
    );

  }

  _renderCallingCode = () => {

    if (this.state.enterCode)
      return (
        <View />
      );

    return (
      <View style={styles.callingCodeView}>
        <Text style={styles.callingCodeText}>+{this.state.country.callingCode}</Text>
      </View>
    );

  }

  _renderContent() {
    let headerText = `What's your ${this.state.enterCode ? 'verification code' : 'phone number'}?`
    let buttonText = this.state.enterCode ? 'Verify confirmation code' : 'Send confirmation code';
    let textStyle = this.state.enterCode ? {
      height: 50,
      textAlign: 'center',
      fontSize: 40,
      fontWeight: 'bold',
    } : {};

    return (
      <Content padder contentContainerStyle={Standart.container}>
        <Grid>
          <Row style={Standart.container}>
            <Text style={styles.header}>{headerText}</Text>

            <Form ref={'form'} style={styles.form}>

              <View style={{ flexDirection: 'row' }}>

                {this._renderCountryPicker()}
                {this._renderCallingCode()}

                <TextInput
                  ref={'textInput'}
                  name={this.state.enterCode ? 'code' : 'phoneNumber'}
                  type={'TextInput'}
                  underlineColorAndroid={'transparent'}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={this._onChangeText}
                  placeholder={this.state.enterCode ? '_ _ _ _ _ ' : 'Phone Number'}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  style={[styles.textInput, textStyle]}
                  returnKeyType='go'
                  autoFocus
                  // placeholderTextColor={brandColor}
                  // selectionColor={brandColor}
                  maxLength={this.state.enterCode ? 5 : 20}
                  onSubmitEditing={this._getSubmitAction} />

              </View>

              {this._renderFooter()}

            </Form>

          </Row>
          <Row style={Standart.buttonRow}>
            <Button
              iconLeft
              block
              primary
              style={Standart.button}
              onPress={this._getSubmitAction}>
              <Icon ios="ios-person-add" android="md-person-add" />
              <Text>{buttonText}</Text>
            </Button>
          </Row>
        </Grid>
      </Content>);
  };
}
