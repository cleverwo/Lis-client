// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem('vendplat30-authority');
}

export function setAuthority(authority) {
  return sessionStorage.setItem('vendplat30-authority', authority);
}

export function getToken() {
  return sessionStorage.getItem('vendplat30-token');
}

export function setToken(token) {
  return sessionStorage.setItem('vendplat30-token', token);
}

export function setRefreshAfterLogin(flag) {
  return sessionStorage.setItem('vendplat30-refreshAfterLogin', flag);
}

export function getRefreshAfterLogin() {
  return sessionStorage.getItem('vendplat30-refreshAfterLogin');
}
