import React, { Component, Fragment } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { connect } from 'dva';
import JSEncrypt from 'node-jsencrypt';
import { injectIntl } from 'react-intl';

const FormItem = Form.Item;

@injectIntl
@connect(({ userSetting, login }) => ({
  userSetting,
  login,
}))
@Form.create()
export default class PwdSetting extends Component {
  // 提交修改信息
  handleSubmit = e => {
    const { validateFields } = this.props.form;
    const { dispatch, userId, intl } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/pre',
          callback: publicKey => {
            const { oldPwd, newPwd } = values;
            let params = {};
            const encrypt = new JSEncrypt(); // 实例化加密对象
            encrypt.setPublicKey(publicKey); // 设置公钥
            let pwd = encrypt.encrypt(newPwd); // 加密明文
            params.newPassword = pwd;
            params.newPasswordAgain = pwd;
            if (!!oldPwd) {
              params.oldPassword = encrypt.encrypt(oldPwd); // 加密明文
            }
            dispatch({
              type: 'login/changePwd',
              payload: params,
              callback: () => {
                if (!userId) {
                  message.success(intl.formatMessage({ id: 'personCenter.success.changePwd' }));
                  dispatch({
                    type: 'login/logout',
                  });
                } else {
                  this.clearModal();
                }
              },
            });
          },
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 8 },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    // 比照两次输入密码
    let checkPwd = (rule, value, callback) => {
      if (value && value !== getFieldValue('newPwd')) {
        callback('两次输入密码不一致');
      } else {
        callback();
      }
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="原密码" required={true}>
              {getFieldDecorator('oldPwd', {
                rules: [{ required: true, message: '请输入原密码密码！' }],
              })(<Input type="password" placeholder="输入原密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码" required={true}>
              {getFieldDecorator('newPwd', {
                rules: [{ required: true, message: '请输入新密码！' }],
              })(<Input type="password" placeholder="输入新密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码" required={true}>
              {getFieldDecorator('confirm', {
                rules: [{ validator: checkPwd }, { required: true, message: '请再次确认密码！' }],
                validateTrigger: 'onBlur',
              })(<Input type="password" placeholder="确认新密码" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </Fragment>
    );
  }
}
