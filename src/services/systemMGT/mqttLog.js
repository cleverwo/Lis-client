import newRequest from '../../utils/newRequest';

export async function queryLog(params) {
  return newRequest('/admin/operationLog/searchMqtt', {
    method: 'POST',
    body: params,
  });
}

export async function getMqttType() {
  return newRequest('/admin/operationLog/getMqttType', {
    method: 'GET',
  });
}

export async function queryCtwingLog(params) {
  return newRequest('/admin/operationLog/searchCtwingLog', {
    method: 'POST',
    body: params,
  });
}
