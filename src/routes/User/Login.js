import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, Switch } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import { injectIntl } from 'react-intl';
import { getLocale, setLocale } from '../../locale/locale';
import JSEncrypt from 'node-jsencrypt';
import { message } from 'antd/lib/index';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
@injectIntl
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      if (type === 'account') {
        dispatch({
          type: 'login/pre',
          callback: publicKey => {
            const { username, password } = values;
            let params = null;
            //TODO:验证码登录就不加密了暂时
            if (!!password) {
              const encrypt = new JSEncrypt(); // 实例化加密对象
              encrypt.setPublicKey(publicKey); // 设置公钥
              let pwd = encrypt.encrypt(password); // 加密明文
              params = {
                username: username,
                password: pwd,
              };
            } else {
              params = { ...payload };
            }
            dispatch({
              type: 'login/login',
              payload: {
                ...params,
                type,
              },
            });
          },
        });
      } else {
        const { mobile, captcha } = values;
        dispatch({
          type: 'login/phoneLogin',
          payload: {
            phone: mobile,
            checkCode: captcha,
            type,
          },
        });
      }
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  localeOnChange = () => {
    let locale = getLocale();
    if ('zh-CN' == locale) {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
    window.location.reload(true);
  };

  handleChange = event => {
    let phone = event.target.value;
    let checkPhone = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/;
    const { dispatch } = this.props;
    if (checkPhone.test(phone)) {
      dispatch({
        type: 'login/checkoutPhoneIsEmpty',
        payload: {
          phone: phone,
        },
      });
    }
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, err => {
        const { dispatch, login } = this.props;
        if (err) {
          reject(err);
        } else if (!login.phone) {
          message.error('手机号错误，请重新输入');
        } else {
          dispatch({
            type: 'login/sendAuthCode',
            payload: login.phone,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  render() {
    const { login, submitting, intl } = this.props;
    const { type } = this.state;

    let curLocale = null;
    let otherLocale = null;
    const locale = getLocale();
    if (locale == 'zh-CN') {
      curLocale = '中文';
      otherLocale = '英文';
    } else {
      curLocale = 'English';
      otherLocale = 'Chinese';
    }
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={intl.formatMessage({ id: 'login.way.username' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage(intl.formatMessage({ id: 'login.error.accountOrPwd' }))}
            <UserName name="username" placeholder={intl.formatMessage({ id: 'login.username' })} />
            <Password name="password" placeholder={intl.formatMessage({ id: 'login.pwd' })} />
          </Tab>
          {/*<Tab key="mobile" tab={intl.formatMessage({ id: 'login.way.mobile' })}>*/}
            {/*{login.status === 'error' &&*/}
              {/*login.type === 'mobile' &&*/}
              {/*!login.submitting &&*/}
              {/*this.renderMessage(intl.formatMessage({ id: 'login.error.captcha' }))}*/}
            {/*<Mobile name="mobile" onChange={this.handleChange} />*/}
            {/*<Captcha name="captcha" onGetCaptcha={this.onGetCaptcha} />*/}
          {/*</Tab>*/}
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              {intl.formatMessage({ id: 'login.autoLogin' })}
            </Checkbox>
            {/*<Switch*/}
              {/*checkedChildren={curLocale}*/}
              {/*unCheckedChildren={otherLocale}*/}
              {/*defaultChecked*/}
              {/*onChange={this.localeOnChange}*/}
            {/*/>*/}
            {/*<Link style={{ float: 'right' }} to="/user/forgotPassword">*/}
              {/*{intl.formatMessage({ id: 'login.forgetPwd' })}*/}
            {/*</Link>*/}
          </div>
          <Submit loading={submitting}>{intl.formatMessage({ id: 'login.login' })}</Submit>
          {/* 屏蔽掉注册以及第三方登录 */}
          {/* <div className={styles.other}>
            {intl.formatMessage({ id: 'login.way.other' })}
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              {intl.formatMessage({ id: 'login.register' })}
            </Link>
          </div> */}
        </Login>
      </div>
    );
  }
}
