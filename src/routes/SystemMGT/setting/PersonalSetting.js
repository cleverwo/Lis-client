import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';

@connect()
export default class PersonalSetting extends Component {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'basic':
        dispatch(routerRedux.push(`${match.url}/basic`));
        break;
      case 'password':
        dispatch(routerRedux.push(`${match.url}/password`));
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'basic',
        tab: '基本信息',
      },
      {
        key: 'password',
        tab: '密码设置',
      },
    ];

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);

    return (
      <PageHeaderLayout
        title="个人设置"
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
