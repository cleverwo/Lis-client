import newRequest from '../../utils/newRequest';

export async function queryRoleFunctions(params) {
  return newRequest(`/admin/rolePermission/function/${params}`, {
    method: 'POST',
  });
}

export async function addRolePermission(params) {
  return newRequest('/admin/rolePermission', {
    method: 'PUT',
    body: params,
  });
}
