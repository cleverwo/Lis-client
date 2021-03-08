import newRequest from '../../utils/newRequest';

export async function findList(params) {
  return newRequest(`/admin/operationsmgt/vendorTrackDeploy`, {
    method: 'POST',
    body: params,
  });
}

export async function get(params) {
  return newRequest(`/admin/operationsmgt/vendorTrackDeploy/${params}`, {
    method: 'GET',
  });
}

//更新售货机货道部署
export async function update(params) {
  return newRequest(`/admin/operationsmgt/vendorTrackDeploy`, {
    method: 'PATCH',
    body: params,
  });
}
