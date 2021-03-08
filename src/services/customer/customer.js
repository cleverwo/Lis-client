import newRequest from '../../utils/newRequest';

export async function addCustomer(params) {
  return newRequest(`/admin/customer`, {
    method: 'PUT',
    body: params,
  });
}

export async function updateCustomer(params) {
  return newRequest(`/admin/customer`, {
    method: 'PATCH',
    body: params,
  });
}

export async function removeCustomer(params) {
  return newRequest(`/admin/customer/${params}`, {
    method: 'DELETE',
  });
}

export async function fetchCustomer(params) {
  return newRequest(`/admin/customer`, {
    method: 'POST',
    body: params,
  });
}

export async function reCharge(params) {
  return newRequest(`/admin/customer/reCharge`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCustomer(params) {
  return newRequest(`/admin/customer/list`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOperateList(params) {
  return newRequest(`/admin/meterHistory/operateList`, {
    method: 'POST',
    body: params,
  });
}

export async function validCustomerPhone(params) {
  return newRequest(`/admin/customer/phone/${params}`, {
    method: 'GET',
  });
}

export async function changeWaterMeter(params) {
  return newRequest(`/admin/customer/changeWaterMeter`, {
    method: 'POST',
    body: params,
  });
}

export async function findWaterMeterCode(params) {
  return newRequest(`/admin/customer/meterValidation`, {
    method: 'POST',
    body: params,
  });
}
