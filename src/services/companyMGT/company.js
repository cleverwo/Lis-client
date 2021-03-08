import newRequest from '../../utils/newRequest';

export async function getHallSimpleList() {
  return newRequest('/admin/company/getHallSimpleList', {
    method: 'GET',
  });
}

export async function getBranchCoSimpleList() {
  return newRequest('/admin/company/getBranchCoSimpleList', {
    method: 'GET',
  });
}

export async function queryBranchCoList(params) {
  return newRequest('/admin/company/searchBranchCompany', {
    method: 'POST',
    body: params,
  });
}

export async function queryBusinessHallList(params) {
  return newRequest('/admin/company/searchBusinessHall', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCo(params) {
  return newRequest(`/admin/company/${params}`, {
    method: 'DELETE',
  });
}

export async function addBranchCo(params) {
  return newRequest(`/admin/company/addBranchCo`, {
    method: 'PATCH',
    body: params,
  });
}

export async function updateBranchCo(params) {
  return newRequest(`/admin/company/updateBranchCo`, {
    method: 'PATCH',
    body: params,
  });
}

export async function addBusinessHall(params) {
  return newRequest(`/admin/company/addBusinessHall`, {
    method: 'PATCH',
    body: params,
  });
}

export async function updateBusinessHall(params) {
  return newRequest(`/admin/company/updateBusinessHall`, {
    method: 'PATCH',
    body: params,
  });
}

export async function getThisCoInfo() {
  return newRequest('/admin/company/getThisCoInfo', {
    method: 'GET',
  });
}

export async function updateThisCo(params) {
  return newRequest(`/admin/company/updateThisCo`, {
    method: 'PATCH',
    body: params,
  });
}
