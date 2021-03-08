import newRequest from '../../utils/newRequest';

export async function queryLog(params) {
  return newRequest('/admin/operationLog/searchBankLog', {
    method: 'POST',
    body: params,
  });
}


