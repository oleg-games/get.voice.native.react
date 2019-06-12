import { createDrawerNavigator } from 'react-navigation';
import QuestionsBottomTabNavigator from './Questions/QuestionsBottomTabNavigator'
import AnswersBottomTabNavigator from './Answers/AnswersBottomTabNavigator'
// import ImageBrowser from './ImageBrowser'
// import ImagePicker from './ImagePicker'

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
    // Images: {
    //     screen: ImageBrowser,
    // },
    // ImagePicker: {
    //     screen: ImagePicker,
    // },
},{
    initialRouteName: 'Answers',
});