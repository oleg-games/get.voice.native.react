import { createStackNavigator } from 'react-navigation';
import ForMeAnswersScreen from '../../../screens/Answers/ForMeAnswersScreen'

export default createStackNavigator({
    ForMe: ForMeAnswersScreen,
},{
    initialRouteName: 'ForMe',
});