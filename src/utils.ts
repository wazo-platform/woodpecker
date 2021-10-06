import AsyncStorage from '@react-native-async-storage/async-storage';

export const isMobile = typeof navigator != 'undefined' && navigator.product === 'ReactNative';

export const storeValue = async (key: string, value: string) => {
  if (isMobile) {
    return AsyncStorage.setItem(key, value);
  }

  return localStorage.setItem(key, value);
};

export const getStoredValue = async (key: string) => {
  if (isMobile) {
    return AsyncStorage.getItem(key);
  }

  return localStorage.getItem(key);
};

export const removeStoredValue = (key: string) => {
  if (isMobile) {
    return AsyncStorage.setItem(key, '');
  }

  return localStorage.removeItem(key);
};
