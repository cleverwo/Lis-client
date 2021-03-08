import newRequest from '../../utils/newRequest';

export async function queryReplenishRecord(params) {
  return newRequest('/admin/operationsmgt/replenishRecord', {
    method: 'POST',
    body: params,
  });
}
export async function outputExcel(params) {
  return newRequest(`/admin/operationsmgt/replenishRecord/outputExcel/${params}`, {
    method: 'GET',
  });
}
