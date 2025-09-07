import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppBottomNavigator from './AppBottomNavigator';
import CategorySelectionScreen from '../features/add/CategorySelectionScreen';
import ResidentialSaleFormScreen from '../features/add/forms/ResidentialSaleFormScreen';
import ResidentialRentalFormScreen from '../features/add/forms/ResidentialRentalFormScreen';
import CommercialSaleFormScreen from '../features/add/forms/CommercialSaleFormScreen';
import NewProjectFormScreen from '../features/add/forms/NewProjectFormScreen';
import ProjectFinderScreen from '../features/projects/ProjectFinderScreen';
import ProjectComparisonDeckScreen from '../features/projects/ProjectComparisonDeckScreen';
import { RootStackParamList } from './types'; // <-- CORRECTED IMPORT

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={AppBottomNavigator} />
      <RootStack.Screen name="CategorySelection" component={CategorySelectionScreen} />
      <RootStack.Screen name="ResidentialSaleForm" component={ResidentialSaleFormScreen} />
      <RootStack.Screen name="ResidentialRentalForm" component={ResidentialRentalFormScreen} />
      <RootStack.Screen name="CommercialSaleForm" component={CommercialSaleFormScreen} />
      <RootStack.Screen name="NewProjectForm" component={NewProjectFormScreen} />
      <RootStack.Screen name="ProjectFinder" component={ProjectFinderScreen} />
      <RootStack.Screen name="ProjectComparisonDeck" component={ProjectComparisonDeckScreen} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;