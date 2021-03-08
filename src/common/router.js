import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/test': {
      component: dynamicWrapper(app, [], () => import('../routes/index')),
    },
    /* --------------------------------------------------- 用户开户 ----------------------------------*/
    '/customer/register': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/Register')
      ),
    },
    '/customer/register/customerInfo': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/Register/CustomerInfo')
      ),
    },
    '/customer/register/selectMeter': {
      component: dynamicWrapper(app, ['customerMGT/meter'], () =>
        import('../routes/CustomerMGT/Register/SelectMeter')
      ),
    },
    '/customer/register/meterInfo': {
      component: dynamicWrapper(
        app,
        ['customerMGT/customer', 'customerMGT/meter', 'waterPriceMGT/waterPrice'],
        () => import('../routes/CustomerMGT/Register/MeterInfo')
      ),
    },
    '/customer/register/result': {
      component: dynamicWrapper(app, ['customerMGT/meter', 'customerMGT/customer'], () =>
        import('../routes/CustomerMGT/Register/RegisterResult')
      ),
    },
    /* --------------------------------------------------- 用户缴费 ----------------------------------*/
    '/customer/topUp': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/PayStep')
      ),
    },
    '/customer/topUp/payBefore': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/PayStep/PayBefore')
      ),
    },
    '/customer/topUp/payMoney': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/PayStep/PayMoney')
      ),
    },
    '/customer/topUp/result': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/PayStep/PayResult')
      ),
    },
    /* --------------------------------------------------- 水表管理 ----------------------------------*/
    //水表列表
    '/meter/meters': {
      component: dynamicWrapper(app, ['watermetermgt/waterMeter', 'companyMGT/company','systemMGT/addressSystem','productMGT/product'], () =>
        import('../routes/WatermeterMGT/WaterMeter')
      ),
    },
    //用户列表
    '/meter/customerList': {
      component: dynamicWrapper(app, ['customerMGT/customer'], () =>
        import('../routes/CustomerMGT/Customer')
      ),
    },
    /* --------------------------------------------------- 区域管理 ----------------------------------*/
    '/areas/community': {
      component: dynamicWrapper(app, ['areaMGT/community'], () =>
        import('../routes/AreaMGT/Community')
      ),
    },
    /* --------------------------------------------------- 记录管理 ----------------------------------*/
    //用水记录
    '/charge/waterUsedRecord': {
      component: dynamicWrapper(app, ['recordMGT/waterRecord', 'user'], () =>
        import('../routes/RecordMGT/waterRecord/WaterUsedRecord')
      ),
    },
    //收费记录
    '/charge/payRecord': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/RecordMGT/payRecord/WaterPayRecord')
      ),
    },
    '/charge/payRecord/offline': {
      component: dynamicWrapper(app, ['waterPriceMGT/payRecord', 'waterPriceMGT/waterPrice', 'companyMGT/person'], () =>
        import('../routes/RecordMGT/payRecord/PayRecordOffline')
      ),
    },
    '/charge/payRecord/online': {
      component: dynamicWrapper(app, ['waterPriceMGT/payRecord', 'waterPriceMGT/waterPrice'], () =>
        import('../routes/RecordMGT/payRecord/PayRecordOnline')
      ),
    },
    //收费统计
    '/charge/statistics': {
      component: dynamicWrapper(app, ['recordMGT/payStatistics','waterPriceMGT/waterPrice','companyMGT/person'], () =>
        import('../routes/RecordMGT/PayStatistics')
      ),
    },
    //水表更换记录
    '/charge/changeRecord': {
      component: dynamicWrapper(app, ['watermetermgt/waterMeterChange'], () =>
        import('../routes/WatermeterMGT/changeRecord/ChangeRecord')
      ),
    },
    /* --------------------------------------------------- 水价管理 ----------------------------------*/
    //水价管理
    '/waterPrice/waterPrice': {
      component: dynamicWrapper(app, ['waterPriceMGT/waterPrice', 'companyMGT/company'], () =>
        import('../routes/WatermeterMGT/waterprice/WaterPrice')
      ),
    },
    /* --------------------------------------------------- 通知管理 ----------------------------------*/
    //通知管理
    '/notice/notice': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/AlarmMGT/Alarm')),
    },
    // 数据报警
    '/notice/notice/dataAlarm': {
      component: dynamicWrapper(app, ['alarmMGT/alarm'], () =>
        import('../routes/AlarmMGT/DataAlarm')
      ),
    },
    // 设备报警
    '/notice/notice/deviceAlarm': {
      component: dynamicWrapper(app, ['alarmMGT/alarm'], () =>
        import('../routes/AlarmMGT/DeviceAlarm')
      ),
    },
    /* --------------------------------------------------- 公司管理 ----------------------------------*/
    //人员管理
    '/company/admin': {
      component: dynamicWrapper(app, ['companyMGT/person'], () =>
        import('../routes/CompanyMGT/person/AdminList')
      ),
    },
    //子公司管理
    '/company/branchCompany': {
      component: dynamicWrapper(app, ['companyMGT/company'], () =>
        import('../routes/CompanyMGT/BranchCompany')
      ),
    },
    //营业厅管理
    '/company/businessHall': {
      component: dynamicWrapper(app, ['companyMGT/company'], () =>
        import('../routes/CompanyMGT/BusinessHall')
      ),
    },

    /* --------------------------------------------------- 权限设置 ----------------------------------*/
    //角色管理
    '/power/role': {
      component: dynamicWrapper(app, ['authorityMGT/role', 'authorityMGT/userTransfer'], () =>
        import('../routes/authorityMGT/Role/RoleList')
      ),
    },
    //权限管理
    '/power/permission': {
      component: dynamicWrapper(
        app,
        [
          'authorityMGT/rolePermission',
          'authorityMGT/rolePermissionTransfer',
          'authorityMGT/rolePermissionTree',
        ],
        () => import('../routes/authorityMGT/Permission/RolePermissionList')
      ),
    },

    // /* --------------------------------------------------- 系统设置 ----------------------------------*/
    // //数据备份
    // '/system/dataBackup': {
    //   component: dynamicWrapper(app, [], ()=>
    //     import('../routes/systemmgt/dataBackup')
    //   ),
    // },
    //日志管理
    '/system/log': {
      component: dynamicWrapper(app, ['systemMGT/operationLog'], () =>
        import('../routes/SystemMGT/LogList')
      ),
    },
    //mqtt日志管理
    '/system/mqttLog': {
      component: dynamicWrapper(app, ['systemMGT/mqttLog'], () =>
        import('../routes/SystemMGT/MqttLogList')
      ),
    },
    //银行日志
    '/system/bankLog': {
      component: dynamicWrapper(app, ['systemMGT/bankLog'], () =>
        import('../routes/SystemMGT/BankLogList')
      ),
    },
    //电信平台日志
    '/system/ctwing': {
      component: dynamicWrapper(app, ['systemMGT/ctwingLog'], () =>
        import('../routes/SystemMGT/CtwingList')
      ),
    },
    // 电信平台产品列表
    '/system/product': {
      component: dynamicWrapper(app, ['systemMGT/ctwingProduct'], () =>
        import("../routes/SystemMGT/CtwingProductList")
      ),
    },
    // /* --------------------------------------------------- 右上角设置 ----------------------------------*/
    // 个人设置
    '/personalSetting': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/SystemMGT/setting/PersonalSetting')
      ),
    },
    // 基本设置
    '/personalSetting/basic': {
      component: dynamicWrapper(app, ['systemMGT/userSetting'], () =>
        import('../routes/SystemMGT/setting/BasicSetting')
      ),
    },
    // 密码设置
    '/personalSetting/password': {
      component: dynamicWrapper(app, ['systemMGT/userSetting', 'login'], () =>
        import('../routes/SystemMGT/setting/PwdSetting')
      ),
    },
    //本公司管理
    '/company/thisCompany': {
      component: dynamicWrapper(app, ['companyMGT/company'], () =>
        import('../routes/CompanyMGT/ThisCompany')
      ),
    },

    /*
    /!* --------------------------------------------------- 权限管理 ----------------------------------*!/
    //角色管理
    '/authorityMgnt/roleMgnt': {
      component: dynamicWrapper(app, ['adminmgt/role', 'transfer/userTransfer'], () =>
        import('../routes/adminmgt/RoleList')
      ),
    },
    //权限设置
    '/authorityMgnt/authoritySetting': {
      component: dynamicWrapper(app, ['adminmgt/authSetting'], () =>
        import('../routes/adminmgt/AuthSetting')
      ),
    },

    //权限分配
    '/authorityMgnt/permissionAllocation': {
      component: dynamicWrapper(
        app,
        [
          'adminmgt/rolePermission',
          'transfer/rolePermissionTransfer',
          'adminmgt/rolePermissionTree',
        ],
        () => import('../routes/adminmgt/RolePermissionList')
      ),
    },*/

    /* --------------------------------------------------- 异常显示页 ----------------------------------*/
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/forgotPassword': {
      component: dynamicWrapper(app, ['forgotPassword'], () =>
        import('../routes/User/ForgotPassword')
      ),
    },
    '/user/forgotPassword-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/ForgotPasswordResult')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
