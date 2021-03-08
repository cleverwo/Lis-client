import newRequest from '../../utils/newRequest';

export async function queryList(params) {
  return newRequest(`/admin/record/payStatistics/list`, {
    method: 'POST',
    body: params,
  });
}

export async function statisticsMoney(params) {
  return newRequest(`/admin/record/payStatistics/statistics`, {
    method: 'POST',
    body: params,
  });
}

export async function queryMoneyStatisticsList(params) {
  return newRequest(`/admin/record/payStatistics/moneyDataList`, {
    method: 'POST',
    body: params,
  });
}


export async function queryViewStatisticsList(params) {
  return newRequest(`/admin/record/payStatistics/viewStatistics`, {
    method: 'POST',
    body: params,
  });
}
