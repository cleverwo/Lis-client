import React, { PropTypes } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Tabs, Buttonm, Button, Icon, message, Badge } from 'antd';
import { routerRedux, Link } from 'dva/router';
import Authorized from '../components/Authorized/Authorized';
import Exception from '../components/Exception';
import { injectIntl } from 'react-intl';

/**
 * tab控制
 */
@injectIntl
export default class TabController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      panes: [],
    };
  }

  componentWillMount() {
    const { name, keys, component, authority } = this.props;
    const panes = this.state.panes;
    if (keys === '/' || !name) {
      return;
    }
    const activeKey = keys;
    panes.push({ name, key: activeKey, component, authority });
    this.setState({ panes, activeKey });
  }

  componentWillReceiveProps(nextProps) {
    const { name, keys, component, authority } = nextProps;
    if (keys === '/' || !name) {
      return;
    }
    const panes = this.state.panes;
    const activeKey = keys;
    let isExist = false;
    for (let i = 0; i < panes.length; i++) {
      if (panes[i].key === activeKey) {
        isExist = true;
        break;
      }
    }

    if (isExist) {
      //如果已经存在
      this.setState({
        activeKey,
      });
    } else {
      panes.push({ name, key: activeKey, component, authority });
      this.setState({ panes, activeKey });
    }
  }

  onChange = activeKey => {
    // this.setState({ activeKey });
    this.props.dispatch(
      routerRedux.push({
        pathname: activeKey,
      })
    );
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    if (this.state.panes.length === 1) {
      message.warning(this.props.intl.formatMessage({ id: 'common.tabs.canNotCloseAll' }));
      return;
    }
    let activeKey = this.state.activeKey;
    let lastIndex = this.state.panes.findIndex(pane => pane.key === targetKey) - 1;
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (activeKey === targetKey) {
      activeKey = panes[lastIndex >= 0 ? lastIndex : 0].key;
    }
    this.setState({ panes, activeKey });
  };

  removeAll = () => {
    if (this.state.panes.length === 1) {
      message.warning(this.props.intl.formatMessage({ id: 'common.tabs.canNotCloseAll' }));
      return;
    }
    let activeKey = 0;
    const panes = this.state.panes.filter(pane => pane.key == 0);
    this.setState({ panes, activeKey });
  };

  render() {
    const { location, match } = this.props;
    return this.state.panes.length > 0 ? (
      <div>
        <div>
          {this.state.panes.map(pane => (
            <Authorized
              authority={pane.authority}
              noMatch={
                <Exception
                  type="403"
                  style={{ minHeight: 500, height: '80%' }}
                  linkElement={Link}
                />
              }
            >
              <pane.component location={location} match={match} />
            </Authorized>
          ))}
        </div>
      </div>
    ) : (
      ''
    );
  }
}
