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

  'common.head.switch.locale': 'SwitchLanguage',
  'common.head.setting': 'Setting',
  'common.head.logout': 'Logout',
  'common.head.personcenter': 'PersonCenter',

  'common.detail': 'Detail',
  'common.delete': 'Delete',
  'common.view': 'View',
  'common.edit': 'Edit',
  'common.search': 'Search',
  'common.reset': 'Reset',
  'common.expand': 'Expand',
  'common.retract': 'retract',
  'common.operation': 'operation',
  'common.please.input': 'please input ',
  'common.please.select': 'please select',
  'common.clear.done': 'Cleared',
  'common.status': 'status',
  'common.description': 'description',
  'common.code': 'code',
  'common.type': 'type',

  'common.tabs.canNotCloseAll': 'can not close all tabs',
  'common.deleteConfirmTitle': 'Do you Want to delete these items?',
};
