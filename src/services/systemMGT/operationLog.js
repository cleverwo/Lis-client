import newRequest from '../../utils/newRequest';

export async function queryCompanyList() {
  return newRequest('/admin/company/getCoSimpleList', {
    method: 'GET',
  });
}

export async function queryLog(params) {
  return newRequest('/admin/operationLog/searchLog', {
    method: 'POST',
    body: params,
  });
}
