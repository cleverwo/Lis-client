//added by wangteng for deal apis related with security
import newRequest from '../utils/newRequest';

export async function preLogin() {
  return newRequest('/auth/pre', { method: 'POST' });
}

export async function login(params) {
  return newRequest('/auth/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout() {
  return newRequest('/auth/logout', {
    method: 'POST',
  });
}

export async function changePwd(params) {
  return newRequest('/auth/changePwd', {
    method: 'POST',
    body: params,
  });
}

export async function checkoutPhoneIsEmpty(params) {
  return newRequest('/admin/user/phoneLogin/checkoutPhoneIsEmpty', {
    method: 'POST',
    body: params,
  });
}

export async function sendAuthCode(params) {
  return newRequest('/admin/user/phoneLogin/sendAuthCode', {
    method: 'POST',
    body: params,
  });
}

export async function phoneLogin(params) {
  return newRequest('/admin/user/phoneLogin', {
    method: 'POST',
    body: params,
  });
}

export async function sendAuthCodeForgotPassword(params) {
  return newRequest('/admin/user/forgotPassword/sendAuthCodeForgotPassword', {
    method: 'POST',
    body: params,
  });
}

export async function checkoutPhoneNext(params) {
  return newRequest('/admin/user/forgotPassword/checkoutPhoneNext', {
    method: 'POST',
    body: params,
  });
}

export async function forgotPasswordByPhone(params) {
  return newRequest('/admin/user/forgotPassword/forgotPasswordByPhone', {
    method: 'POST',
    body: params,
  });
}

export async function forgotPasswordByMail(params) {
  return newRequest('/admin/user/forgotPassword/forgotPasswordByMail', {
    method: 'POST',
    body: params,
  });
}
