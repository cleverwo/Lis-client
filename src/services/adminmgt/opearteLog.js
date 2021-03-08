import newRequest from '../../utils/newRequest';

export async function querySystemLog(params) {
  return newRequest('/admin/adminmgt/systemlog', {
    method: 'POST',
    body: params,
  });
}
