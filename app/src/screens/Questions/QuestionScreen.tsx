import React from 'react';
import GVComponent from '../../components/GVComponent';
import { Image, Alert, PermissionsAndroid } from 'react-native';
import { Textarea, Form, Grid, Icon, Row, Content, Button, Text, Label } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Contacts from 'react-native-contacts';
import Standart from '../../styles/standart';
import StorageConst from '../../constants/Storage';
import { Axios } from '../../http';

export default class QuestionScreen extends GVComponent {

	constructor(props) {
		super(props);
		this.state = {
			phoneNumber: '',
			url: '',
			questionText: '',
			question: undefined,
			text: '',
			value: '',
			containsError: false,
			isLoadingImg: false,
		};
	}

	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;

		return {
			title: params && params.id ? 'Question' : 'New Question',
		};
	};



	componentWillUnmount = async () => {
		await AsyncStorage.removeItem(StorageConst.QUESTION);
	}

	_loadParams = async () => {
		try {
			this._isLoading(true);
			const phoneNumber = await AsyncStorage.getItem(StorageConst.PHONE_NUMBER);
			const questionId = await AsyncStorage.getItem(StorageConst.QUESTION);

			if (questionId) {
				const { data: question } = await Axios.get(`/questions/${questionId}`);
				this.setState({ question });
			}

			this.setState({ phoneNumber });
		} catch (err) {
			this._errorHandler(err);
		} finally {
			this._isLoading(false);
		}
	}

	_onAddQuestion = async () => {
		if (!this.state.questionText) {
			Alert.alert('Please fill question text')
			return;
		}

		try {
			this._isLoading(true);
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
						const allContacts = contacts.reduce((all: string[], el: Contacts.Contact) =>
							el.phoneNumbers && el.phoneNumbers.length
								? all.concat(el.phoneNumbers.map((phoneNumber: any) => phoneNumber.number))
								: all
							, [])
						await Axios.post('/questions', {
							text: this.state.questionText,
							images: images && images.length ? images : undefined,
							contacts: allContacts,
						});
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
		this.setState({ questionText: '' })
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
						// const url = this.state.imgSource;
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

	_renderContent() {
		return (
			<Content padder contentContainerStyle={Standart.container}>
				<Grid>
					<Row style={Standart.container}>
						<Form style={{ flex: 1 }}>
							<Label
								style={this.state.question ? Standart.questionText : Standart.NONE}>
								{this.state.question && this.state.question.text}
							</Label>
							<Textarea
								rowSpan={5}
								style={!this.state.question ? Standart.questionText : Standart.NONE}
								value={this.state.questionText}
								bordered
								placeholder="Question"
								onChangeText={(questionText) => this.setState({ questionText })} />
							<Button
								iconLeft
								block
								light
								style={!this.state.question ? Standart.button : Standart.NONE}
								onPress={this._onAddImage}>
								<Icon name='add' />
								<Text> Add Image </Text>
							</Button>
							<Image
								source={!this.state.question ? { uri: this.state.imgSource } : { uri: this.state.question.images && this.state.question.images[0] }}
								style={Standart.questionImage}
							/>
						</Form>
					</Row>
					<Row style={!this.state.question ? Standart.buttonRow : Standart.NONE}>
						<Button
							iconLeft
							block
							primary
							disabled={this.state.isLoadingImg}
							style={Standart.button}
							onPress={this._onAddQuestion}>
							<Icon ios="ios-person-add" android="md-person-add" />
							<Text> Submit </Text>
						</Button>
					</Row>
				</Grid>
			</Content>);
	}
}