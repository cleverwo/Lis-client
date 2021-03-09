import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Switch } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { getLocale } from '../../locale/locale';
import { injectIntl } from 'react-intl';

@injectIntl
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      } else if (newNotice.createTime) {
        newNotice.datetime = moment(notice.createTime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      //todo:根据状态添加不同图标，先写死为了好看点
      newNotice.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png';
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      onNoticeClick,
      intl,
      noticeTypes,
    } = this.props;

    let curLocale = null;
    let otherLocale = null;
    const locale = getLocale();
    if (locale == 'zh-CN') {
      curLocale = '中文';
      otherLocale = 'English';
    } else {
      curLocale = 'English';
      otherLocale = '中文';
    }

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/*<Menu.Item>*/}
        {/*<a href="../admin#/personcenter/personCenter">*/}
        {/*<Icon type="user" />*/}
        {/*{intl.formatMessage({ id: 'common.head.personcenter' })}{' '}*/}
        {/*</a>*/}
        {/*</Menu.Item>*/}
        <Menu.Item key="thisCompany">
          <Icon type="layout" />
          {intl.formatMessage({ id: 'common.head.thisCompany' })}
        </Menu.Item>
        <Menu.Item key="setting">
          <Icon type="setting" />
          {intl.formatMessage({ id: 'common.head.setting' })}
        </Menu.Item>
        {/*<Menu.Item key="changeLocale">*/}
          {/*<Icon type="form" />{' '}*/}
          {/*<Switch checkedChildren={curLocale} unCheckedChildren={otherLocale} defaultChecked />*/}
        {/*</Menu.Item>*/}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          {intl.formatMessage({ id: 'common.head.logout' })}
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <NoticeIcon
            className={styles.action}
            count={1}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onNoticeClick={onNoticeClick}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            {!!noticeTypes && noticeTypes.length > 0
              ? noticeTypes.map(item => (
                  <NoticeIcon.Tab
                    key={item}
                    list={noticeData[item.code]}
                    title={item.description}
                    emptyText={intl.formatMessage({ id: 'notice.todo.allReaded' })}
                    emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                  />
                ))
              : null}
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
