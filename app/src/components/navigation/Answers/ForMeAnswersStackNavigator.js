import { createStackNavigator } from 'react-navigation';
import ForMeAnswersScreen from '@screens/Answers/ForMeAnswersScreen'
import AnswerScreen from '@screens/Answers/AnswerScreen'

export default createStackNavigator({
    ForMe: ForMeAnswersScreen,
    ForMeAnswer: AnswerScreen,
},{
    initialRouteName: 'ForMe',
});