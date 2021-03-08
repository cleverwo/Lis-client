import newRequest from '../../utils/newRequest';

export async function queryWithdrawMoneyAudit(params) {
  return newRequest('/admin/personcenter/withdrawMoneyAudit', {
    method: 'POST',
    body: params,
  });
}
export async function queryBusiness(params) {
  return newRequest('/admin/personcenter/withdrawMoneyAudit/business', {
    method: 'POST',
    body: params,
  });
}
export async function queryBankCard(params) {
  return newRequest('/admin/personcenter/withdrawMoneyAudit/bankCard', {
    method: 'POST',
    body: params,
  });
}
export async function checkWithdraw(params) {
  return newRequest(`/admin/personcenter/withdrawMoneyAudit/withdraw`, {
    method: 'POST',
    body: params,
  });
}

export async function add(params) {
  return newRequest('/admin/personcenter/withdrawMoneyAudit', {
    method: 'PUT',
    body: params,
  });
}
