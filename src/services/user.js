import newRequest from '../utils/newRequest';

//获取用户列表(用户基本信息)
export async function findList(params) {
  return newRequest('/admin/user', {
    method: 'POST',
    body: params,
  });
}
//获取当前用户信息
export async function findCurrent() {
  return newRequest('/admin/user/info');
}
//获取当前用户未读消息条数
export async function findUnreadNoticeCnt() {
  return newRequest('/admin/user/noticecnt');
}
//获取当前用户权限列表
export async function findAuthorities(params) {
  return newRequest('/admin/authorities', {
    method: 'POST',
    body: params,
  });
}
//创建用户时，校验用户输入的电话是否已存在
export async function checkPhoneUnique(params) {
  return newRequest('/admin/user/checkPhone', {
    method: 'POST',
    body: params,
  });
}
