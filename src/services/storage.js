import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic storage helpers
export const setItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
  }
};

export const getItem = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// App-specific storage keys
export const STORAGE_KEYS = {
  DRAFT_PROPERTY: 'draft_property',
  DRAFT_REQUIREMENT: 'draft_requirement',
  APP_SETTINGS: 'app_settings',
  THEME_PREFERENCE: 'theme_preference'
};

// Save draft property
export const saveDraftProperty = async (propertyData) => {
  await setItem(STORAGE_KEYS.DRAFT_PROPERTY, propertyData);
};

// Get draft property
export const getDraftProperty = async () => {
  return await getItem(STORAGE_KEYS.DRAFT_PROPERTY);
};

// Clear draft property
export const clearDraftProperty = async () => {
  await removeItem(STORAGE_KEYS.DRAFT_PROPERTY);
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAll,
  STORAGE_KEYS,
  saveDraftProperty,
  getDraftProperty,
  clearDraftProperty
};