import newRequest from '../../utils/newRequest';

export async function getCurUserInfo() {
  return newRequest('/admin/user/info', {
    method: 'GET',
  });
}

export async function updateUserInfo(params) {
  return newRequest('/admin/user/updateUserInfo', {
    method: 'POST',
    body: params,
  });
}
