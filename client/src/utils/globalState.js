// File name: globalState
// File name with extension: globalState.js
// Full path: E:\cloud_ShubhamJadhav\client\src\utils\globalState.js
// Directory: E:\cloud_ShubhamJadhav\client\src\utils

import { APP_CONFIG as _cfg } from "../../shared/config";

export const GlobalState = {
  getUser: () => {
    try {
      // const user = JSON.parse(localStorage.getItem(_cfg.STORAGE_KEYS.CUSTOMER));
      return (
        JSON.parse(localStorage.getItem(_cfg.STORAGE_KEYS.CUSTOMER)) || null
      );
    } catch {
      return null;
    }
  },

  setUser: (user) => {
    if (!user) return;
    localStorage.setItem(_cfg.STORAGE_KEYS.CUSTOMER, JSON.stringify(user));
  },
  removeUser: () => localStorage.removeItem(_cfg.STORAGE_KEYS.CUSTOMER),
  isLoggedIn: () => !!this.getUser()
};
