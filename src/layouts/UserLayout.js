import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';
import { injectIntl } from 'react-intl';

@injectIntl
class UserLayout extends React.PureComponent {
  links = () => {
    const { intl } = this.props;
    const links = [
      {
        key: 'help',
        title: intl.formatMessage({ id: 'login.help' }),
        href: '',
      },
      {
        key: 'privacy',
        title: intl.formatMessage({ id: 'login.privacy' }),
        href: '',
      },
      {
        key: 'terms',
        title: intl.formatMessage({ id: 'login.terms' }),
        href: '',
      },
    ];
    return links;
  };

  copyright = () => {
    const { intl } = this.props;
    const copyright = (
      <Fragment>
        Copyright <Icon type="copyright" /> {intl.formatMessage({ id: 'global.copyright' })}
      </Fragment>
    );
    return copyright;
  };

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'LIS系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - LIS系统`;
    }
    return title;
  }
  render() {
    const { routerData, match, intl } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>{intl.formatMessage({ id: 'login.title' })}</span>
                </Link>
              </div>
              <div className={styles.desc}>{intl.formatMessage({ id: 'login.purpose' })}</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter links={this.links()} copyright={this.copyright()} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
