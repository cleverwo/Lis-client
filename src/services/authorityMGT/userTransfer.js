import newRequest from '../../utils/newRequest';

export async function queryUser() {
  return newRequest(`/admin/user/transfer`);
}
