import newRequest from '../../utils/newRequest';

export async function queryStockOutStatistics(params) {
  return newRequest('/admin/operationsmgt/stockOutStatistics', {
    method: 'POST',
    body: {
      ...params,
      status: '3',
    },
  });
}
