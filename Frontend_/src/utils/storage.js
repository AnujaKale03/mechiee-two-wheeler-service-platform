// utils/storage.js
// Uses @react-native-async-storage/async-storage
// Install: npm install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'mechiee_auth_token';
const USER_KEY  = 'mechiee_user';

export const saveAuthToken = token => AsyncStorage.setItem(TOKEN_KEY, token);
export const getAuthToken  = ()    => AsyncStorage.getItem(TOKEN_KEY);
export const removeAuthToken = ()  => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = user => AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser  = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const clearAuth = () => Promise.all([removeAuthToken(), AsyncStorage.removeItem(USER_KEY)]);