import { createDrawerNavigator } from 'react-navigation';
import QuestionsBottomTabNavigator from './Questions/QuestionsBottomTabNavigator'
import AnswersBottomTabNavigator from './Answers/AnswersBottomTabNavigator'
import ImageBrowser from './ImageBrowser'
import ImagePicker from './ImagePicker'
// import ListOfItems from '@components/ListOfItems'
// import ListOfNextItems from '@components/ListOfNextItems'
// import MainImage from '../components/MainImage'

export default createDrawerNavigator({
    Questions: {
        screen: QuestionsBottomTabNavigator,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: `Questions`,
        }),
    },
    Answers: {
        screen: AnswersBottomTabNavigator,
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
            title: `Answers`,
        }),
    },
    Images: {
        screen: ImageBrowser,
    },
    ImagePicker: {
        screen: ImagePicker,
    },
    // ListOfItems: {
    //     screen: ListOfItems,
    // },
    // ListOfNextItems: {
    //     screen: ListOfNextItems,
    // },
    // MainImage: {
    //     screen: MainImage,
    // }
},{
    // initialRouteName: 'Answers',
});