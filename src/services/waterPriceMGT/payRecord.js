import newRequest from '../../utils/newRequest';

export async function queryPayRecordOffline(params) {
  return newRequest(`/admin/payRefund/queryPayRecordOffline`, {
    method: 'POST',
    body: params,
  });
}

export async function queryPayRecordOnline(params) {
  return newRequest(`/admin/payRefund/queryPayRecordOnline`, {
    method: 'POST',
    body: params,
  });
}
