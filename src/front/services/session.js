const TOKEN_KEY = "token";

export const session = {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (!token) return;
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() {
    return Boolean(sessionStorage.getItem(TOKEN_KEY));
  },
};
