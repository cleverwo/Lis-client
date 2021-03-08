import newRequest from '../../utils/newRequest';

export async function changeBindingPhone(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter', {
    method: 'PATCH',
    body: {
      personInfoId: params.personInfo.id,
      cellPhone: params.personInfo.cellPhone,
    },
  });
  return respoonse;
}

// 校验银行卡，并返回其对应的银行名称和类型
export async function validCardNumber(params) {
  return newRequest('/admin/changeOptimization/personCenter/bankCard/cardNumber', {
    method: 'POST',
    body: params,
  });
}

export async function addBankCard(params) {
  return newRequest('/admin/changeOptimization/personCenter/bankCard', {
    method: 'POST',
    body: params,
  });
}

export async function checkSize(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/money', {
    method: 'POST',
    body: {
      money: params.money,
      businessId: params.businessId,
    },
  });
  return respoonse;
}

export async function WithDraw(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/WithDraw', {
    method: 'POST',
    body: {
      availMoney: params.record.availMoney * 10000,
      businessId: params.businessId,
      bankCardId: params.record.cardId,
      remark: params.record.remark,
      withdrawPwd: params.record.withdrawPwd,
      supervisor: params.record.supervisor,
    },
  });
  return respoonse;
}

export async function changeIsEffective(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/effective', {
    method: 'POST',
    body: {
      isEffective: params.isEffective,
      bankCardId: params.bankCardId,
    },
  });
  return respoonse;
}

export async function queryBankList(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/bankList', {
    method: 'POST',
    body: {
      businessId: params,
    },
  });
  return respoonse;
}
// 发送验证码
export async function sendCheckCode(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/sendCheckCode', {
    method: 'POST',
    body: {
      phone: params,
    },
  });
  return respoonse;
}

export async function sendCardCheckCode(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/sendCardCheckCode', {
    method: 'POST',
    body: {
      phone: params,
    },
  });
  return respoonse;
}

export async function compareCheckCode(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/compareCheckCode', {
    method: 'POST',
    body: {
      checkCode: params,
    },
  });
  return respoonse;
}

export async function compareCardCheckCode(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/compareCardCheckCode', {
    method: 'POST',
    body: {
      checkCode: params,
    },
  });
  return respoonse;
}

export async function changeWithDrawPwd(params) {
  const respoonse = newRequest('/admin/changeOptimization/personCenter/changeWithDrawPwd', {
    method: 'POST',
    body: {
      businessId: params.businessId,
      oldPassword: params.oldPassword,
      newPassword: params.newPassword,
      busId: params.busId,
      userId: params.userId,
    },
  });
  return respoonse;
}
