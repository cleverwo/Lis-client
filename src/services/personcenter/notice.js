import newRequest from '../../utils/newRequest';

//用户未读消息列表，无分页信息 ，含发件人信息
export async function queryUnReadNotice() {
  return newRequest('/admin/welcome/notice/unread', { method: 'GET' });
}
//用户发送的消息列表，不含发件人信息
export async function sendedNotices(params) {
  return newRequest('/admin/welcome/notice/sended', {
    method: 'POST',
    body: params,
  });
}
//用户发送的单条消息详情，含收件人ID列表
export async function sendedNotice(params) {
  return newRequest(`/admin/welcome/notice/sended/${params}`, { method: 'GET' });
}
//用户收到的消息列表，含发件人信息
export async function receivedNotices(params) {
  return newRequest('/admin/welcome/notice/received', {
    method: 'POST',
    body: params,
  });
}
//用户收到的单条消息详情，不含收件人ID列表
export async function receivedNotice(params) {
  return newRequest(`/admin/welcome/notice/received/${params}`, { method: 'GET' });
}

export async function updateNotice(params) {
  return newRequest('/admin/welcome/notice', {
    method: 'PATCH',
    body: params,
  });
}

export async function createNotice(params) {
  return newRequest('/admin/welcome/notice', {
    method: 'PUT',
    body: params,
  });
}

export async function listType() {
  return newRequest('/admin/welcome/notice/type', {
    method: 'GET',
  });
}

export async function userTree() {
  return newRequest('/admin/welcome/notice/tree/user', {
    method: 'GET',
  });
}
