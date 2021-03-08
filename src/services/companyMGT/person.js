import newRequest from '../../utils/newRequest';

export async function queryPerson(params) {
  return newRequest('/admin/user/searchUsers', {
    method: 'POST',
    body: params,
  });
}

export async function queryCompanyList() {
  return newRequest('/admin/company/getCoSimpleList', {
    method: 'GET',
  });
}

export async function queryRoleList() {
  return newRequest('/admin/role/getRoleSelectList', {
    method: 'GET',
  });
}

export async function validName(params) {
  return newRequest(`/admin/user/valid/${params}`, {
    method: 'GET',
  });
}

export async function resetPass(params) {
  return newRequest(`/admin/user/resetPwd/${params}`, {
    method: 'POST',
  });
}

export async function addPerson(params) {
  return newRequest('/admin/user', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUser(params) {
  return newRequest(`/admin/user/deleteUser`, {
    method: 'POST',
    body: params,
  });
}

export async function getSubordinateList() {
  return newRequest('/admin/user/getSubordinate', {
    method: 'GET',
  });
}
