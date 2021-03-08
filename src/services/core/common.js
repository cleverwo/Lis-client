import newRequest from '../../utils/newRequest';

export async function queryEnumeration(params) {
  return newRequest(`/admin/common/enumeration`, {
    method: 'POST',
    body: params,
  });
}
export async function queryFile(params) {
  return newRequest('/admin/common/get_file', {
    method: 'POST',
    body: params,
  });
}

export async function regionVendors(params) {
  return newRequest('/admin/common/regionVendors', {
    method: 'POST',
    body: params,
  });
}
