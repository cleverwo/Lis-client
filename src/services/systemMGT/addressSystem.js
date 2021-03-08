import newRequest from '../../utils/newRequest';

export async function queryProvinceList() {
  return newRequest('/admin/addressSystem/queryProvinceTreeList', {
    method: 'GET',
  });
}
