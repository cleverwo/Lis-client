import newRequest from '../../utils/newRequest';

export async function queryProductList() {
  return newRequest('/admin/ctwing/productList', {
    method: 'GET',
  });
}

export async function refreshProductList() {
  return newRequest('/admin/ctwing/productList', {
    method: 'POST',
  });
}

export async function getProductList() {
  return newRequest('/admin/product/list', {
    method: 'POST',
  });
}
