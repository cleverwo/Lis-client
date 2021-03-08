import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';

@connect(({ user }) => ({
  authorities: user.authorities,
}))
export default class WaterPayRecord extends Component {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'offline':
        dispatch(routerRedux.push(`${match.url}/offline`));
        break;
      case 'online':
        dispatch(routerRedux.push(`${match.url}/online`));
        break;
      default:
        break;
    }
  };

  render() {

    const { match, routerData, location, authorities, } = this.props;
    const routes = getRoutes(match.path, routerData);

    const isAdmin = authorities.indexOf('am_waterCharge_view') > -1; // 是否为管理员

    const tabList = isAdmin ? [
      {
        key: 'offline',
        tab: '大厅缴费',
      },
      {
        key: 'online',
        tab: '微信缴费',
      },
    ] : [
      {
        key: 'offline',
        tab: '大厅缴费',
      },
    ];

    return (
      <PageHeaderLayout
        title="缴费记录"
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </PageHeaderLayout>
    );
  }
}
