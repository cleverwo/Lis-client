import newRequest from '../../utils/newRequest';

//查询所有商户的基本信息，用于商户穿梭框及下拉框
export async function listAll(params) {
  return newRequest(`/admin/merchant/business`, {
    method: 'POST',
    body: params,
  });
}
