import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'nest_connect_auth_token';
const USER_DATA_KEY = 'nest_connect_user_data';

/**
 * Securely saves the authentication token.
 * Uses SecureStore on iOS/Android for hardware-level encryption.
 */
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token securely, falling back to AsyncStorage:', error);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves the authentication token.
 */
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.warn('Could not read from SecureStore, trying AsyncStorage:', error);
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
};

/**
 * Saves the user and tenant data to standard storage.
 */
export const saveUserData = async (data) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Retrieves the user and tenant data.
 */
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clears all authentication data upon logout.
 */
export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error during logout:', error);
  }
};