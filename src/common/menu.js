import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '首页',
    icon: 'home',
    path: 'welcome',
  },
  /*样本管理 */
  {
    name: '样本管理',
    icon: 'book',
    path: 'sample',
    children: [
      {
        name: '样本采集',
        icon: 'book',
        path: 'collect',
      },
      {
        name: '样本核收',
        icon: 'bulb',
        path: 'accept',
      },
      {
        name: '样本留存',
        icon: 'bulb',
        path: 'receive',
      },
    ],
  },
  /*样本检测*/
  {
    name: '样本检测',
    icon: 'filter',
    path: 'task',
  },
  /*检测报告管理*/
  {
    name: '检测报告管理',
    icon: 'copy',
    path: 'report',
  },
  /*仪器终端管理*/
  {
    name: '仪器终端管理',
    icon: 'hdd',
    path: 'instrument',
  },
  /*质控管理*/
  {
    name: '质控管理',
    icon: 'bar-chart',
    path: 'qc',
  },
  /*危急值管理*/
  {
    name: '危急值管理',
    icon: 'heart',
    path: 'critical ',
  },
  /*试剂管理*/
  {
    name: '试剂管理',
    icon: 'medicine-box',
    path: 'reagent ',
  },
  /*TAT管理*/
  {
    name: 'TAT管理',
    icon: 'coffee',
    path: 'time ',
  },
  /*权限管理*/
  {
    name: '权限管理',
    icon: 'key',
    path: 'power',
    children: [
      {
        name: '人员管理',
        icon: 'setting',
        path: 'role',
      },
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
    icon: 'setting',
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
    authority: 'guest',
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
