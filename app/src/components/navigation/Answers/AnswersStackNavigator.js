import { createStackNavigator } from 'react-navigation';
import MyAnswersScreen from '@screens/Answers/MyAnswersScreen'
import AnswerScreen from '@screens/Answers/AnswerScreen'

export default createStackNavigator({
    My: MyAnswersScreen,
    MyAnswer: AnswerScreen,
},{
    initialRouteName: 'My',
});