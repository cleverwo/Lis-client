import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect()
export default class Alarm extends Component {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'dataAlarm':
        dispatch(routerRedux.push(`${match.url}/dataAlarm`));
        break;
      case 'deviceAlarm':
        dispatch(routerRedux.push(`${match.url}/deviceAlarm`));
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'dataAlarm',
        tab: '数据错误报警',
      },
      {
        key: 'deviceAlarm',
        tab: '设备异常报警',
      },
    ];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);

    return (
      <PageHeaderLayout
        title="警报管理"
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
