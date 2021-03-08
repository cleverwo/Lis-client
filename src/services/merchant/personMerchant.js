import newRequest from '../../utils/newRequest';

export async function create(params) {
  return newRequest('/admin/merchant/person', {
    method: 'PUT',
    body: params,
  });
}

export async function checkUserNameUnique(params) {
  return newRequest(`/admin/merchant/person/check/username/${params}`, { method: 'GET' });
}

export async function checkNameUnique(params) {
  return newRequest(`/admin/merchant/person/check/name/${params}`, { method: 'GET' });
}

export async function list(params) {
  return newRequest(`/admin/merchant/person`, {
    method: 'POST',
    body: params,
  });
}

export async function get(params) {
  return newRequest(`/admin/merchant/person/${params}`, { method: 'GET' });
}

export async function update(params) {
  return newRequest(`/admin/merchant/person`, {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return newRequest(`/admin/merchant/person/${params}`, { method: 'DELETE' });
}
