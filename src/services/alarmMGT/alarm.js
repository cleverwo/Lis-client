import newRequest from '../../utils/newRequest';

export async function queryDataAlarmList(params) {
  return newRequest('/admin/alarm/searchDataAlarmInfo', {
    method: 'POST',
    body: params,
  });
}

export async function queryDeviceAlarmList(params) {
  return newRequest('/admin/alarm/searchDeviceAlarmInfo', {
    method: 'POST',
    body: params,
  });
}

export async function processDeviceAlarm(param) {
  return newRequest(`/admin/alarm/processDeviceAlarm/${param}`, {
    method: 'POST',
  });
}

export async function processDataAlarm(param) {
  return newRequest(`/admin/alarm/processDataAlarm/${param}`, {
    method: 'POST',
  });
}
