import newRequest from '../../utils/newRequest';

export async function queryChangeRecord(params) {
  return newRequest('/admin/waterMeter/searchChangeRecord', {
    method: 'POST',
    body: params,
  });
}
