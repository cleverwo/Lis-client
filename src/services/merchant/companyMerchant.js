import newRequest from '../../utils/newRequest';

export async function create(params) {
  return newRequest('/admin/merchant/company', {
    method: 'PUT',
    body: params,
  });
}

export async function checkUserNameUnique(params) {
  return newRequest(`/admin/merchant/company/check/username/${params}`, { method: 'GET' });
}

export async function checkNameUnique(params) {
  return newRequest(`/admin/merchant/company/check/name/${params}`, { method: 'GET' });
}

export async function list(params) {
  return newRequest(`/admin/merchant/company`, {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return newRequest(`/admin/merchant/company`, {
    method: 'PATCH',
    body: params,
  });
}

export async function remove(params) {
  return newRequest(`/admin/merchant/company/${params}`, { method: 'DELETE' });
}
