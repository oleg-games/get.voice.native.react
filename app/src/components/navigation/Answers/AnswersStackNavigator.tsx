import { createStackNavigator } from 'react-navigation';
import MyAnswersScreen from '../../../screens/Answers/MyAnswersScreen'

export default createStackNavigator({
    My: MyAnswersScreen,
},{
    initialRouteName: 'My',
});