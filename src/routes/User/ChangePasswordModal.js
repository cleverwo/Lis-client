import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Select, Button, message } from 'antd';

import { connect } from 'dva/index';
import { injectIntl } from 'react-intl';
import JSEncrypt from 'node-jsencrypt';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const InputGroup = Input.Group;

//超级管理员设置其他用户密码
const AdminForm = ({ intl, form, userId }) => {
  const passwordValidator = (rule, value, callback) => {
    if (!value || value.length < 5 || value.lentgh > 21) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.length' }));
      return;
    }
    let newPasswordAgain = form.getFieldValue('newPasswordAgain');
    if (!!newPasswordAgain && value != newPasswordAgain) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.same' }));
    } else {
      //两次密码输入不一致，输入一致后清理掉另一个密码的错误提示
      if (form.getFieldError('newPasswordAgain')) {
        form.validateFields(['newPasswordAgain'], { force: true });
      }
      callback();
    }
  };
  const passwordAgainValidator = (rule, value, callback) => {
    if (!value || value.length < 5 || value.lentgh > 21) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.length' }));
    }
    let newPassword = form.getFieldValue('newPassword');
    if (value != newPassword) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.same' }));
    } else {
      //两次密码输入不一致，输入一致后清理掉另一个密码的错误提示
      if (form.getFieldError('newPassword')) {
        form.validateFields(['newPassword'], { force: true });
      }
      callback();
    }
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  return (
    <Form>
      <div style={{ display: 'none' }}>
        <FormItem {...formItemLayout}>
          {form.getFieldDecorator('userId', {
            initialValue: userId,
          })(<Input disabled={true} />)}
        </FormItem>
      </div>
      <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'merchant.newPassword' })}>
        {form.getFieldDecorator('newPassword', {
          rules: [
            {
              required: true,
              validator: passwordValidator,
            },
          ],
        })(
          <Input
            maxLength={21}
            type="password"
            placeholder={intl.formatMessage({ id: 'merchant.please.input.newPassword' })}
          />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={intl.formatMessage({ id: 'merchant.newPassword.again' })}
      >
        {form.getFieldDecorator('newPasswordAgain', {
          rules: [
            {
              required: true,
              validator: passwordAgainValidator,
            },
          ],
        })(
          <Input
            maxLength={21}
            type="password"
            placeholder={intl.formatMessage({ id: 'merchant.please.input.newPassword' })}
          />
        )}
      </FormItem>
    </Form>
  );
};

//用户设置自己密码
const UserForm = ({ intl, form }) => {
  const passwordValidator = (rule, value, callback) => {
    if (!value || value.length < 5 || value.lentgh > 21) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.length' }));
      return;
    }
    let newPasswordAgain = form.getFieldValue('newPasswordAgain');
    if (!!newPasswordAgain && value != newPasswordAgain) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.same' }));
    } else {
      if (form.getFieldError('newPasswordAgain')) {
        form.validateFields(['newPasswordAgain'], { force: true });
      }
      callback();
    }
  };
  const passwordAgainValidator = (rule, value, callback) => {
    if (!value || value.length < 5 || value.lentgh > 21) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.length' }));
      return;
    }
    let newPassword = form.getFieldValue('newPassword');
    if (value != newPassword) {
      callback(intl.formatMessage({ id: 'adminperson.error.pwd.valid.same' }));
    } else {
      if (form.getFieldError('newPassword')) {
        form.validateFields(['newPassword'], { force: true });
      }
      callback();
    }
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  return (
    <Form>
      <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'pwd.old' })}>
        {form.getFieldDecorator('oldPassword', {
          rules: [
            {
              required: true,
              message: intl.formatMessage({ id: 'pwd.please.input.old' }),
            },
          ],
        })(
          <Input type="password" placeholder={intl.formatMessage({ id: 'pwd.please.input.old' })} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'pwd.new' })}>
        {form.getFieldDecorator('newPassword', {
          rules: [
            {
              required: true,
              validator: passwordValidator,
            },
          ],
        })(
          <Input
            maxLength={21}
            type="password"
            placeholder={intl.formatMessage({ id: 'pwd.please.input.new' })}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'pwd.new.confirm' })}>
        {form.getFieldDecorator('newPasswordAgain', {
          rules: [
            {
              required: true,
              validator: passwordAgainValidator,
            },
          ],
        })(
          <Input
            maxLength={21}
            type="password"
            placeholder={intl.formatMessage({ id: 'pwd.please.input.new.confirm' })}
          />
        )}
      </FormItem>
    </Form>
  );
};

@injectIntl
@connect(({ login }) => ({
  login,
}))
class ChangePwdModal extends Component {
  clearModal = () => {
    this.props.hideModal();
  };
  onOk = () => {
    const { form, dispatch, userId, intl } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'login/pre',
        callback: publicKey => {
          const { oldPassword, newPassword } = fieldsValue;
          let params = null;
          const encrypt = new JSEncrypt(); // 实例化加密对象
          encrypt.setPublicKey(publicKey); // 设置公钥
          let pwd = encrypt.encrypt(newPassword); // 加密明文
          fieldsValue.newPassword = pwd;
          fieldsValue.newPasswordAgain = pwd;
          if (!!oldPassword) {
            let old = encrypt.encrypt(oldPassword); // 加密明文
            fieldsValue.oldPassword = old;
          }
          dispatch({
            type: 'login/changePwd',
            payload: fieldsValue,
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
    });
  };
  onCancel = () => {
    this.clearModal();
  };
  render() {
    const { intl, form, visible, hideModal, userId } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const title = intl.formatMessage({ id: 'login.changePwd' });
    const ModalProps = {
      title: title,
      visible: visible,
      onOk: this.onOk,
      onCancel: this.onCancel,
      destroyOnClose: true,
      maskClosable: false,
    };
    const formProps = {
      form: form,
      intl: intl,
      userId: userId,
    };
    return (
      <Modal {...ModalProps}>
        {userId ? <AdminForm {...formProps} /> : <UserForm {...formProps} />}
      </Modal>
    );
  }
}

export default Form.create()(ChangePwdModal);
