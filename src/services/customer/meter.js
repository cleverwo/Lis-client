import newRequest from '../../utils/newRequest';

export async function queryMeters(params) {
  return newRequest(`/admin/waterMeter`, {
    method: 'POST',
    body: params,
  });
}

export async function queryWaterMeters(params) {
  return newRequest(`/admin/waterMeter`, {
    method: 'POST',
    body: params,
  });
}

export async function addMeter(params) {
  return newRequest(`/admin/waterMeter`, {
    method: 'PUT',
    body: params,
  });
}

export async function updateMeter(params) {
  return newRequest(`/admin/waterMeter`, {
    method: 'PATCH',
    body: params,
  });
}

export async function removeWaterMeter(params) {
  return newRequest(`/admin/waterMeter/${params}`, {
    method: 'DELETE',
  });
}

export async function changeMeterStatus(params) {
  return newRequest(`/admin/waterMeter/changeStatus`, {
    method: 'POST',
    body: params,
  });
}

export async function queryWaterRecord(params) {
  return newRequest(`/admin/waterRecord/searchWaterRecord`, {
    method: 'POST',
    body: params,
  });
}

export async function queryWaterRecordDetail(params) {
  return newRequest(`/admin/waterRecord/detail`, {
    method: 'POST',
    body: params,
  });
}

export async function queryOperateList(params) {
  return newRequest(`/admin/meterHistory/operateList`, {
    method: 'POST',
    body: params,
  });
}

export async function queryRequestList(params) {
  return newRequest(`/admin/meterHistory/requestList`, {
    method: 'POST',
    body: params,
  });
}

export async function setMeterRequest(params) {
  return newRequest(`/admin/meterHistory/setRequestHistory`, {
    method: 'POST',
    body: params,
  });
}

export async function meterSettlementDate(params) {
  return newRequest(`/admin/meterHistory/settlementDate`, {
    method: 'POST',
    body: params,
  });
}

export async function meterStandardTime(params) {
  return newRequest(`/admin/meterHistory/standardTime`, {
    method: 'POST',
    body: params,
  });
}

export async function meterSyncData(params) {
  return newRequest(`/admin/meterHistory/syncData`, {
    method: 'POST',
    body: params,
  });
}

export async function meterSubmissionTime(params) {
  return newRequest(`/admin/meterHistory/submissionTime`, {
    method: 'POST',
    body: params,
  });
}

export async function meterIpAddress(params) {
  return newRequest(`/admin/meterHistory/IpAddress`, {
    method: 'POST',
    body: params,
  });
}
export async function meterWarnParameter(params) {
  return newRequest(`/admin/meterHistory/WarnParameter`, {
    method: 'POST',
    body: params,
  });
}

export async function meterOffline(params) {
  return newRequest(`/admin/meterHistory/Offline`, {
    method: 'POST',
    body: params,
  });
}

export async function meterBalance(params) {
  return newRequest(`/admin/meterHistory/meterBalance`, {
    method: 'POST',
    body: params,
  });
}

export async function meterWaterPrice(params) {
  return newRequest(`/admin/meterHistory/meterWaterPrice`, {
    method: 'POST',
    body: params,
  });
}

export async function meterWaterAddress(params) {
  return newRequest(`/admin/meterHistory/meterWaterAddress`, {
    method: 'POST',
    body: params,
  });
}

export async function meterValueControl(params) {
  return newRequest(`/admin/meterHistory/meterValueControl`, {
    method: 'POST',
    body: params,
  });
}

export async function validWaterMeterCode(params) {
  return newRequest(`/admin/waterMeter/meterCode/${params}`, {
    method: 'GET',
  });
}

export async function validIMEICode(params) {
  return newRequest(`/admin/waterMeter/IMEI/${params}`, {
    method: 'GET',
  });
}

export async function batchAddMeter(params) {
  return newRequest(`/admin/waterMeter/batchCreateMeter`, {
    method: 'POST',
    body: params,
  });
}

export async function batchSetReportTime(params) {
  return newRequest(`/admin/waterMeter/batchSetReportTime`, {
    method: 'POST',
    body: params,
  });
}

export async function findNotSetTimeMeter(params) {
  return newRequest(`/admin/waterMeter/notSetTimeMeter`, {
    method: 'POST',
    body: params,
  });
}

export async function uploadImeiList(params) {
  return newRequest('/admin/waterMeter/uploadImei', {
    method: 'POST',
    body: params,
  });
}
