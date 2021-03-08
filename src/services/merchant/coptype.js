import request from '../../utils/request';
import newRequest from '../../utils/newRequest';
import { stringify } from 'qs';
export async function addCt(params) {
  return newRequest('/admin/merchant/coptype', {
    method: 'PUT',
    body: params,
  });
}

export async function removeCt(params) {
  return newRequest(`/admin/merchant/coptype/${params}`, { method: 'DELETE' });
}

export async function queryCt(params) {
  return newRequest(`/admin/merchant/coptype`, {
    method: 'POST',
    body: params,
  });
}
export async function patchCt(params) {
  return newRequest(`/admin/merchant/coptype`, {
    method: 'PATCH',
    body: params,
  });
}

export async function checkNameUnique(params) {
  return newRequest(`/admin/merchant/coptype/name`, {
    method: 'POST',
    body: params,
  });
}
export async function listCt(params) {
  return newRequest(`/admin/merchant/coptype/list`, {
    method: 'POST',
    body: params,
  });
}
