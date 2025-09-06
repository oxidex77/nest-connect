import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/auth/AuthScreen';
import RegisterScreen from '../screens/auth/RegisterScreen'; // Import the new screen

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={AuthScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;