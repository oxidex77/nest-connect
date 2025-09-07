import 'react-native-get-random-values';
import { registerRootComponent } from 'expo';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './src/redux/store';
import { PaperProvider, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native'; // <-- CORRECTED IMPORT
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { getToken, getUserData } from './src/services/auth';
import { setCredentials } from './src/redux/features/userSlice';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    background: '#F8FAFC',
    surface: '#FFFFFF',
  },
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        const storedToken = await getToken();
        const storedUserData = await getUserData();
        if (storedToken && storedUserData) {
          dispatch(setCredentials({ ...storedUserData, token: storedToken }));
        }
      } catch (e) {
        console.warn('Restoring session failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapApp();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </ReduxProvider>
  );
}

registerRootComponent(App);
export default App;