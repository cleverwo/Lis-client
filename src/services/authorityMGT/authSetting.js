import newRequest from '../../utils/newRequest';

export async function queryTreeNode() {
  return newRequest(`/admin/function/tree`, {
    method: 'GET',
  });
}

export async function queryAuth(params) {
  return newRequest(`/admin/adminmgt/permission`, {
    method: 'POST',
    body: params,
  });
}
export async function addAuth(params) {
  return newRequest(`/admin/adminmgt/permission`, {
    method: 'PUT',
    body: params,
  });
}
export async function patchAuth(params) {
  return newRequest(`/admin/adminmgt/permission`, {
    method: 'PATCH',
    body: params,
  });
}
export async function removeAuth(params) {
  return newRequest(`/admin/adminmgt/permission/${params}`, {
    method: 'DELETE',
  });
}
export async function checkAuthName(params) {
  return newRequest(`/admin/adminmgt/permission/check_name/${params}`, {
    method: 'POST',
  });
}
