import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './components/Authorized';
import styles from './index.less';
import { checkLogin } from './common/authority';
import { IntlProvider } from 'react-intl';
import { messages, antMessages } from './locale/index';
import { locale } from './common/config';
import { getLocale } from './locale/locale';

const { AuthorizedRoute } = Authorized(null);

const { ConnectedRouter } = routerRedux;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  const locale = getLocale();
  return (
    <LocaleProvider locale={antMessages}>
      <IntlProvider locale={locale} messages={messages}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/user" component={UserLayout} />
            <AuthorizedRoute
              path="/"
              render={props => <BasicLayout {...props} />}
              authority={checkLogin}
              redirectPath="/user/login"
            />
          </Switch>
        </ConnectedRouter>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default RouterConfig;
