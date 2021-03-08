import newRequest from '../../utils/newRequest';

export async function addCp(params) {
  return newRequest('/admin/basic/region', {
    method: 'PUT',
    body: params,
  });
}

export async function removeCp(params) {
  return newRequest(`/admin/basic/region/${params}`, { method: 'DELETE' });
}

export async function queryCp(params) {
  return newRequest(`/admin/basic/region`, {
    method: 'POST',
    body: params,
  });
}

export async function patchCp(params) {
  return newRequest(`/admin/basic/region`, {
    method: 'PATCH',
    body: params,
  });
}

export async function queryPerson(params) {
  return newRequest('/admin/basic/region/personInfo', {
    method: 'POST',
    body: params,
  });
}

export async function tree(params) {
  return newRequest(`/admin/basic/region/tree`, { method: 'GET' });
}
