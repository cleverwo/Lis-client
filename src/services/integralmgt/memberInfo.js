import newRequest from '../../utils/newRequest';

export async function queryMemberInfo(params) {
  const response = newRequest('/admin/integralmgt/membermgnt/memberInfo', {
    method: 'POST',
    body: params,
  });
  return response;
}

export async function addMember(params) {
  const response = newRequest('/admin/integralmgt/membermgnt/memberInfo', {
    method: 'PUT',
    body: params,
  });
  return response;
}

export async function removeMember(params) {
  const response = newRequest(`/admin/integralmgt/membermgnt/memberInfo/${params}`, {
    method: 'DELETE',
    body: params,
  });
  return response;
}

export async function updateMember(params) {
  const response = newRequest(`/admin/integralmgt/membermgnt/memberInfo`, {
    method: 'PATCH',
    body: params,
  });
  return response;
}
