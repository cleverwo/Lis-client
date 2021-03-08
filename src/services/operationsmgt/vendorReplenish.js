import newRequest from '../../utils/newRequest';

export async function queryVendorReplenish(params) {
  return newRequest('/admin/operationsmgt/vendorReplenish', {
    method: 'POST',
    body: params,
  });
}

export async function patchVendorReplenish(params) {
  return newRequest('/admin/operationsmgt/vendorReplenish', {
    method: 'PATCH',
    body: params,
  });
}

export async function tree(params) {
  return newRequest('/admin/operationsmgt/vendorReplenish/tree/regionvendor', { method: 'GET' });
}

export async function replenishWholeVendor(params) {
  return newRequest('/admin/operationsmgt/vendorReplenish/replenishWholeVendor', {
    method: 'POST',
    body: params,
  });
}
