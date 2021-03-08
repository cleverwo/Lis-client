import newRequest from '../../utils/newRequest';

export async function queryPermissions() {
  return newRequest(`/admin/transfer/rolePermission`);
}
