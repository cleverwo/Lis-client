import newRequest from '../../utils/newRequest';

export async function create(params) {
  return newRequest('/admin/basic/adminperson', {
    method: 'PUT',
    body: params,
  });
}

export async function checkUserNameUnique(params) {
  return newRequest(`/admin/basic/adminperson/check/username/${params}`, { method: 'GET' });
}

export async function checkNameUnique(params) {
  return newRequest(`/admin/basic/adminperson/check/name/${params}`, { method: 'GET' });
}

export async function list(params) {
  return newRequest(`/admin/basic/adminperson`, {
    method: 'POST',
    body: params,
  });
}

export async function get(params) {
  return newRequest(`/admin/basic/adminperson/${params}`, { method: 'GET' });
}

export async function update(params) {
  return newRequest(`/admin/basic/adminperson`, {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return newRequest(`/admin/basic/adminperson/${params}`, { method: 'DELETE' });
}

export async function resetPass(params) {
  return newRequest(`/admin/basic/adminperson/${params}`, { method: 'PATCH' });
}
