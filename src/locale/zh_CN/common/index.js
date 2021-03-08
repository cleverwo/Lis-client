import global from './global';
import menu from './menu';
import notice from './notice';
import login from './login';
import register from './register';
import button from './button';
import pwd from './pwd';
import forgotPassword from './forgotPassword';

export default {
  ...global,
  ...menu,
  ...notice,
  ...login,
  ...register,
  ...button,
  ...pwd,
  ...forgotPassword,

  'common.head.switch.locale': '切换语言',
  'common.head.setting': '个人设置',
  'common.head.logout': '退出',
  'common.head.personcenter': '个人中心',
  'common.head.thisCompany': '本公司设置',

  'common.detail': '详情',
  'common.delete': '删除',
  'common.view': '查看',
  'common.edit': '编辑',
  'common.search': '查询',
  'common.reset': '重置',
  'common.expand': '展开',
  'common.retract': '收起',
  'common.operation': '操作',
  'common.please.input': '请输入',
  'common.please.select': '请选择',
  'common.clear.done': '清空了',
  'common.status': '状态',
  'common.description': '描述',
  'common.code': '编号',
  'common.type': '类型',

  'common.tabs.canNotCloseAll': '窗口不可以全部关闭',
  'common.deleteConfirmTitle': '确认删除选择的记录？',
};
