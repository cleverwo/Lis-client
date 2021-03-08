import newRequest from '../../utils/newRequest';

export async function queryList(params) {
  return newRequest('/admin/communityApi/list', {
    method: 'POST',
    body: params,
  });
}

export async function addRecord(params) {
  return newRequest('/admin/communityApi', {
    method: 'PUT',
    body: params,
  });
}

export async function removeRecord(params) {
  return newRequest(`/admin/communityApi/${params}`, {
    method: 'DELETE',
    body: params,
  });
}

export async function updateRecord(params) {
  return newRequest(`/admin/communityApi`, {
    method: 'PATCH',
    body: params,
  });
}

export async function deleteBlock(params) {
  return newRequest(`/admin/blockApi/${params}`, {
    method: 'DELETE',
  });
}

export async function insertBlock(params) {
  return newRequest(`/admin/blockApi`, {
    method: 'PUT',
    body: params,
  });
}

export async function queryBlockList(params) {
  return newRequest(`/admin/blockApi/${params}`, {
    method: 'POST',
  });
}

export async function patchBlock(params) {
  return newRequest(`/admin/blockApi`, {
    method: 'PATCH',
    body: params,
  });
}

export async function queryCommunityList() {
  return newRequest(`/admin/blockApi/fiveList`, {
    method: 'POST',
  });
}
