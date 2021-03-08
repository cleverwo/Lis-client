import request from '../../utils/request';
import newRequest from '../../utils/newRequest';

export async function addCp(params) {
  console.log('进入service/test/company.js addCp方法：');
  return newRequest('/admin/basic/company', {
    method: 'PUT',
    body: params,
  });
}

export async function removeCp(params) {
  return newRequest(`/admin/basic/company/${params}`, { method: 'DELETE' });
}

export async function queryCp(params) {
  console.log('这是queryCp');
  return newRequest(`/admin/basic/company`, {
    method: 'POST',
    body: params,
  });
}
export async function patchCp(params) {
  return newRequest(`/admin/basic/company`, {
    method: 'PATCH',
    body: params,
  });
}

export async function checkNameUnique(params) {
  return newRequest(`/admin/basic/company/name`, {
    method: 'POST',
    body: params,
  });
}
export async function checkCertNumUnique(params) {
  return newRequest(`/admin/basic/company/certNum`, {
    method: 'POST',
    body: params,
  });
}
