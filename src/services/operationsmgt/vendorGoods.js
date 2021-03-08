import newRequest from '../../utils/newRequest';
// 查询售货机商品集合
export async function queryVendorGoodsList(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods`, {
    method: 'POST',
    body: {
      ...params,
      status: '3',
    },
  });
}

// // 更新售货机商品
export async function updateVendorGoods(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods`, {
    method: 'PATCH',
    body: params,
  });
}

// 查询商品列表
export async function fetchGoodsList() {
  return newRequest(`/admin/operationsmgt/vendorGoods/goods`, {
    method: 'POST',
  });
}

// 审核人列表
export async function makeApproval(params) {
  return newRequest(`/admin/approval/vendor_good`, {
    method: 'PUT',
    body: {
      vdId: params.record.vdId,
      goodId: params.record.goodId,
      vtId: params.record.vtId,
      trackDeployId: params.record.vtdId,
      totalCount: params.record.totalCount,
      warningCount: params.record.warningCount,
      salePrice: params.record.salePrice * 10000,
      propor: params.record.propors,
      serviceRate: params.record.serviceRate,
      record: params.record,
      description: params.proval.description,
      supervisor: params.proval.supervisor,
    },
  });
}

export async function removeGoods(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods/removeGoods`, {
    method: 'POST',
    body: {
      id: params.id,
    },
  });
}

export async function fetchCommonGoods(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods/fetchCommonGoods`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchGoodsVendor(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods/goodsVendor`, {
    method: 'POST',
    body: {
      goodsId: params.goodsId,
      businessId: params.businessId,
    },
  });
}

export async function fetchPriceGoodsList(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods/priceGoodsList`, {
    method: 'POST',
    body: {
      businessId: params.businessId,
    },
  });
}

export async function batchPrice(params) {
  return newRequest(`/admin/operationsmgt/vendorGoods/price`, {
    method: 'PATCH',
    body: {
      idList: params.idList,
      newPrice: params.newPrice * 10000,
    },
  });
}
