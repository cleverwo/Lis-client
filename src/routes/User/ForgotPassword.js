import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert, Icon, Popover, Input, Button, Progress, Form, Tabs, Steps } from 'antd';
import Login from '../../components/Login';
import Styles from './ForgotPassword.less';
import { injectIntl } from 'react-intl';
import { message } from 'antd/lib/index';
import JSEncrypt from 'node-jsencrypt';

const { Tab, UserName, PasswordAgain, Mobile, Captcha, Submit } = Login;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Step = Steps.Step;
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ forgotPassword, loading }) => ({
  forgotPassword,
  submitting: loading.effects['login/login'],
}))
@injectIntl
export default class ForgotPassword extends Component {
  state = {
    type: 'mobile',
    visible: false,
    visibleAgain: false,
    current: 0,
    help: '',
  };

  onTabChange = type => {
    this.setState({
      visible: false,
    });
    this.setState({
      visibleAgain: false,
    });
    this.setState({ type });
  };

  handlePasswordChange = event => {
    this.setState({
      visible: true,
    });
    // let chekckPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9_]{6,16}$/;
    let password = event.target.value;
    const { dispatch, forgotPassword: { passwordAgain } } = this.props;
    dispatch({
      type: 'forgotPassword/savePassword',
      payload: password,
    });
    if (password === passwordAgain) {
      this.setState({
        visible: false,
      });
      this.setState({
        visibleAgain: false,
      });
    }
  };

  handlePasswordAgainChange = event => {
    this.setState({
      visible: false,
    });
    this.setState({
      visibleAgain: true,
    });
    let passwordAgain = event.target.value;
    const { dispatch, forgotPassword: { password } } = this.props;
    dispatch({
      type: 'forgotPassword/savePasswordAgain',
      payload: passwordAgain,
    });
    if (passwordAgain === password) {
      this.setState({
        visible: false,
      });
      this.setState({
        visibleAgain: false,
      });
    }
  };

  handlePhoneChange = event => {
    let phone = event.target.value;
    let checkPhone = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/;
    const { dispatch } = this.props;
    if (checkPhone.test(phone)) {
      dispatch({
        type: 'forgotPassword/checkoutPhoneIsEmpty',
        payload: {
          phone: phone,
        },
      });
    }
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, err => {
        const { dispatch, forgotPassword } = this.props;
        if (err) {
          reject(err);
        } else if (!forgotPassword.phone) {
          message.error('手机号错误，请重新输入');
        } else {
          dispatch({
            type: 'forgotPassword/sendAuthCodeForgotPassword',
            payload: forgotPassword.phone,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  passwordStatusMap = val => {
    const { intl } = this.props;
    const passwordStatusMap = {
      ok: (
        <div className={Styles.success}>
          {intl.formatMessage({ id: 'forgotPassword.pwd.status.ok' })}
        </div>
      ),
      pass: (
        <div className={Styles.warning}>
          {intl.formatMessage({ id: 'forgotPassword.pwd.status.pass' })}
        </div>
      ),
      poor: (
        <div className={Styles.error}>
          {intl.formatMessage({ id: 'forgotPassword.pwd.status.poor' })}
        </div>
      ),
    };
    return passwordStatusMap[val];
  };

  getPasswordStatus = () => {
    const { forgotPassword } = this.props;
    const value = forgotPassword.password;
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  renderPasswordProgress = () => {
    const { forgotPassword } = this.props;
    const value = forgotPassword.password;
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={Styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={Styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  next = (err, values) => {
    const { dispatch } = this.props;
    const { mobile, captcha } = values;
    let checkPhone = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/;
    if (mobile && captcha && checkPhone.test(mobile)) {
      dispatch({
        type: 'forgotPassword/checkoutPhoneNext',
        payload: {
          phone: mobile,
          captcha: captcha,
        },
        callback: () => {
          const current = this.state.current + 1;
          this.setState({ current });
        },
      });
    }
  };

  phoneSubmit = (err, values) => {
    const { dispatch, forgotPassword } = this.props;
    const { passwordPhone, passwordPhoneAgain } = values;
    if (passwordPhone && passwordPhoneAgain) {
      dispatch({
        type: 'login/pre',
        callback: publicKey => {
          let params = null;
          //TODO:验证码登录就不加密了暂时
          if (!!passwordPhone) {
            const encrypt = new JSEncrypt(); // 实例化加密对象
            encrypt.setPublicKey(publicKey); // 设置公钥
            let pwd = encrypt.encrypt(passwordPhone); // 加密明文
            params = {
              password: pwd,
            };
          } else {
            params = { ...payload };
          }
          dispatch({
            type: 'forgotPassword/phoneSubmit',
            payload: {
              phone: forgotPassword.phone,
              ...params,
            },
            callback: () => {
              const current = this.state.current + 1;
              this.setState({ current });
            },
          });
        },
      });
    }
  };

  render() {
    const { forgotPassword, submitting, intl } = this.props;
    const { type, current } = this.state;
    const steps = [
      {
        title: intl.formatMessage({ id: 'forgotPassword.phone' }),
        content: (
          <div>
            {type === 'mobile' && (
              <Login
                onSubmit={this.next}
                ref={form => {
                  this.loginForm = form;
                }}
              >
                <Mobile name="mobile" onChange={this.handlePhoneChange} />
                <Captcha name="captcha" onGetCaptcha={this.onGetCaptcha} />
                <Submit loading={submitting}>
                  {intl.formatMessage({ id: 'forgotPassword.next' })}
                </Submit>
              </Login>
            )}
            {type === 'mail' && (
              <Login onSubmit={this.next}>
                <Mobile name="mobile" onChange={this.handlePhoneChange} />
                <Captcha
                  name="captcha"
                  onGetCaptcha={() => this.sendAuthCode(forgotPassword.phone)}
                />
                <Submit loading={submitting}>
                  {intl.formatMessage({ id: 'forgotPassword.next' })}
                </Submit>
              </Login>
            )}
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'forgotPassword.password' }),
        content: (
          <div>
            <Login onSubmit={this.phoneSubmit}>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    {this.passwordStatusMap(this.getPasswordStatus())}
                    {this.renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      {intl.formatMessage({ id: 'forgotPassword.error.pwd.toSimple' })}
                    </div>
                  </div>
                }
                overlayStyle={{ width: 350 }}
                placement="right"
                visible={this.state.visible}
              >
                <PasswordAgain
                  name="passwordPhone"
                  onChange={this.handlePasswordChange}
                  placeholder={intl.formatMessage({ id: 'login.pwd' })}
                />
              </Popover>
              <Popover
                content={
                  <div style={{ padding: '4px 0' }}>
                    <div className={Styles.error}>
                      {intl.formatMessage({ id: 'forgotPassword.pwd.check.error' })}
                    </div>
                  </div>
                }
                overlayStyle={{ width: 350 }}
                placement="right"
                visible={this.state.visibleAgain}
              >
                <PasswordAgain
                  name="passwordPhoneAgain"
                  onChange={this.handlePasswordAgainChange}
                  placeholder={intl.formatMessage({ id: 'forgotPassword.confirmPwd' })}
                />
              </Popover>
              <Submit loading={submitting}>
                {intl.formatMessage({ id: 'forgotPassword.next' })}
              </Submit>
            </Login>
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'forgotPassword.success' }),
        content: (
          <div>
            修改密码成功，请<Link to="/user/login">重新登陆</Link>
          </div>
        ),
      },
    ];
    return (
      <div className={Styles.main}>
        <Tabs defaultActiveKey={type} onChange={this.onTabChange}>
          <TabPane key="mobile" tab={intl.formatMessage({ id: 'forgotPassword.phoneFind' })}>
            <div>
              <Steps current={current}>
                {steps.map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <div className={Styles['steps-content']}>{steps[current].content}</div>
            </div>
          </TabPane>
          {/*<TabPane key="mail" tab={intl.formatMessage({id: 'forgotPassword.mailFind'})}>*/}
          {/*<div>*/}
          {/*<Steps current={current}>*/}
          {/*{steps.map(item => <Step key={item.title} title={item.title}/>)}*/}
          {/*</Steps>*/}
          {/*<div className={Styles["steps-content"]}>{steps[current].content}</div>*/}
          {/*</div>*/}
          {/*</TabPane>*/}
        </Tabs>
      </div>
    );
  }
}
