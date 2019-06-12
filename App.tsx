import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthLoadingScreen from './app/src/screens/Auth/AuthLoadingScreen'
import AuthStack from './app/src/stacks/AuthStack'
import AppStack from './app/src/stacks/AppStack'

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));