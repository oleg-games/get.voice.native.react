import { createStackNavigator } from 'react-navigation';
import MyQuestionsScreen from '@screens/Questions/MyQuestionsScreen'
import QuestionScreen from '@screens/Questions/QuestionScreen'

export default createStackNavigator({
    My: MyQuestionsScreen,
    MyQuestion: QuestionScreen,
},{
    initialRouteName: 'My',
});