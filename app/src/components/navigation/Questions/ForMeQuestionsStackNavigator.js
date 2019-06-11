import { createStackNavigator } from 'react-navigation';
import ForMeQuestionsScreen from '@screens/Questions/ForMeQuestionsScreen'
import AnswerScreen from '@screens/Answers/AnswerScreen'

export default createStackNavigator({
    ForMe: ForMeQuestionsScreen,
    ForMeQuestion: AnswerScreen,
},{
    initialRouteName: 'ForMe',
});