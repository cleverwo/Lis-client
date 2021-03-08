import newRequest from '../../utils/newRequest';

export async function queryWaterPriceList() {
  return newRequest(`/admin/waterPrice/list`, {
    method: 'POST',
  });
}

export async function queryHallWaterPrice() {
  return newRequest('/admin/waterPrice/getHallWaterPrice', {
    method: 'GET',
  });
}

export async function queryPriceList(params) {
  return newRequest(`/admin/waterPrice`, {
    method: 'POST',
    body: params,
  });
}

export async function deletePrice(params) {
  return newRequest(`/admin/waterPrice/deleteWaterPrice`, {
    method: 'POST',
    body: params,
  });
}

export async function getPriceDetail(params) {
  return newRequest(`/admin/waterPrice/getWaterPriceDetail/${params}`, {
    method: 'GET',
  });
}

export async function addWaterPrice(params) {
  return newRequest(`/admin/waterPrice/addWaterPrice`, {
    method: 'POST',
    body: params,
  });
}

export async function updateWaterPrice(params) {
  return newRequest(`/admin/waterPrice/updateWaterPrice`, {
    method: 'POST',
    body: params,
  });
}

export async function updateStaircasePrice(params) {
  return newRequest(`/admin/waterPrice/updateStaircasePrice`, {
    method: 'POST',
    body: params,
  });
}

export async function validPriceName(params) {
  return newRequest(`/admin/waterPrice/valid/${params}`, {
    method: 'GET',
  });
}
