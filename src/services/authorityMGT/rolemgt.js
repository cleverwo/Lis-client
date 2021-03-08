import newRequest from '../../utils/newRequest';

export async function queryRole(params) {
  return newRequest('/admin/role/list', {
    method: 'POST',
    body: params,
  });
}

export async function validRoleName(params) {
  return newRequest(`/admin/role/name/${params}`, {
    method: 'GET',
  });
}

export async function addRole(params) {
  return newRequest('/admin/role', {
    method: 'PUT',
    body: params,
  });
}

export async function removeRole(params) {
  return newRequest(`/admin/role/${params}`, {
    method: 'DELETE',
  });
}

export async function updateRole(params) {
  return newRequest('/admin/role', {
    method: 'PATCH',
    body: params,
  });
}

export async function queryUserRoles(params) {
  return newRequest(`/admin/role/userRole/${params}`, {
    method: 'POST',
  });
}

export async function changeUpdate(params) {
  return newRequest(`/admin/role/changeMember`, {
    method: 'PATCH',
    body: params,
  });
}
