import newRequest from '../../utils/newRequest';

// 查询售货机部署列表
export async function findList(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy`, {
    method: 'POST',
    body: params,
  });
}
// 查询售货机日志列表
export async function findLogList(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy/log`, {
    method: 'POST',
    body: params,
  });
}
export async function get(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy/${params}`, { method: 'GET' });
}

//更新售货机状态
export async function changeStatus(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy/status`, {
    method: 'PATCH',
    body: params,
  });
}

export async function update(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy`, {
    method: 'PATCH',
    body: params,
  });
}

export async function screenLog(params) {
  return newRequest(`/admin/operationsmgt/vendordeploy/screenLog`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchVendorTempInfo(params) {
  return newRequest('/admin/operationsmgt/vendordeploy/vendor_temp', {
    method: 'POST',
    body: params,
  });
}

export async function updateVendorTempInfo(params) {
  return newRequest('/admin/operationsmgt/vendordeploy/vendor_temp', {
    method: 'PATCH',
    body: params,
  });
}
