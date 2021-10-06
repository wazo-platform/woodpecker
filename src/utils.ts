export const isMobile = typeof navigator != 'undefined' && navigator.product === 'ReactNative';

export const storeValue = (key: string, value: string) => {
  if (isMobile) {
    return
  }

  return localStorage.setItem(key, value);
};

export const getStoredValue = (key: string) => {
  if (isMobile) {
    return
  }

  return localStorage.getItem(key);
};

export const removeStoredValue = (key: string) => {
  if (isMobile) {
    return
  }

  return localStorage.removeItem(key);
};
