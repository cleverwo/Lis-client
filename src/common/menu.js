import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '用户开户',
    icon: 'user',
    path: 'customer/register',
  },
  {
    name: '用户缴费',
    icon: 'user',
    path: 'customer/topUp',
  },
  /*水表管理*/
  {
    name: '水表管理',
    icon: 'book',
    path: 'meter',
    children: [
      {
        name: '水表列表',
        icon: 'book',
        path: 'meters',
      },
      {
        name: '用户列表',
        icon: 'bulb',
        path: 'customerList',
      },
    ],
  },
  /*区域管理*/
  {
    name: '区域管理',
    icon: 'book',
    path: 'areas',
    children: [
      {
        name: '区域列表',
        icon: 'book',
        path: 'community',
      },
    ],
  },
  /*记录管理*/
  {
    name: '记录管理',
    icon: 'money-collect',
    path: 'charge',
    children: [
      {
        name: '用水记录',
        icon: 'line-chart',
        path: 'waterUsedRecord',
        authority: ['am_waterRecord_view'],
      },
      {
        name: '收费记录',
        icon: 'line-chart',
        path: 'payRecord/offline',
      },
      {
        name: '收费统计',
        icon: 'line-chart',
        path: 'statistics',
      },
      {
        name: '水表更换记录',
        icon: 'book',
        path: 'changeRecord',
      },
    ],
  },
  /*水价管理*/
  {
    name: '水价管理',
    icon: 'rise',
    path: 'waterPrice/waterPrice',
  },
  /*通知管理*/
  {
    name: '报警管理',
    icon: 'alert',
    path: 'notice/notice/dataAlarm',
  },
  /*公司管理*/
  {
    name: '公司管理',
    icon: 'layout',
    path: 'company',
    children: [
      {
        name: '人员管理',
        icon: 'bulb',
        path: 'admin',
        authority: ['am_companyMember_view'],
      },
      {
        name: '子公司管理',
        icon: 'bulb',
        path: 'branchCompany',
        authority: ['am_companyChildren_view'],
      },
      {
        name: '营业厅管理',
        icon: 'bulb',
        path: 'businessHall',
        authority: ['am_companyHall_view'],
      },
    ],
  },
  /*权限设置*/
  {
    name: '权限设置',
    icon: 'setting',
    path: 'power',
    children: [
      {
        name: '角色管理',
        icon: 'setting',
        path: 'role',
      },
      {
        name: '权限管理',
        icon: 'setting',
        path: 'permission',
      },
    ],
  },
  /*系统设置*/
  {
    name: '系统设置',
    icon: 'tool',
    path: 'system',
    children: [
      {
        name: '日志管理',
        icon: 'solution',
        path: 'log',
      },
      {
        name: 'MQTT日志查看',
        icon: 'solution',
        path: 'mqttLog',
      },
      {
        name: '银行支付日志查看',
        icon: 'solution',
        path: 'bankLog',
      },
      {
        name: '电信平台日志查看',
        icon: 'solution',
        path: 'ctwing',
      },
      {
        name: '电信产品列表',
        icon: 'solution',
        path: 'product',
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
