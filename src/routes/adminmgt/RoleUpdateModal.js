import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal } from 'antd';
import { connect } from 'dva/index';
import { injectIntl } from 'react-intl';
import UserTransfer from './UserTransfer';

const FormItem = Form.Item;

const { TextArea } = Input;

@connect(({ role, userTransfer }) => ({
  role,
  userTransfer,
}))
@injectIntl
class RoleUpdateModal extends Component {
  constructor(props) {
    super(props);
  }

  okHandle = () => {
    const { form } = this.props;
    const { role: { updateRole } } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue['roleId'] = updateRole.id;
      this.props.handleUpdate(fieldsValue, form);
    });
  };

  onSelectUserChange = selectedUsers => {
    const { form } = this.props;
    form.setFieldsValue({
      users: selectedUsers,
    });
  };

  clearUserTransfer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userTransfer/clear',
    });
  };

  timeout;
  validRoleName = (rule, value, callback) => {
    const { role: { updateRole }, handleValidRoleName } = this.props;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (value === undefined || value.trim() === '' || value == updateRole.roleName) {
      callback();
      return;
    }
    this.timeout = setTimeout(() => {
      return handleValidRoleName(value, callback);
    }, 300);
  };

  render() {
    const {
      intl,
      form,
      handleModalVisible,
      role: { updateModalVisible, updateRole },
      userTransfer: { targetKeys },
      isEdit,
    } = this.props;

    return (
      <Modal
        destroyOnClose={true}
        width={1000}
        title={isEdit ? '编辑角色' : '查看角色'}
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        footer={isEdit ? undefined : null}
        afterClose={this.clearUserTransfer}
        maskClosable={false}
      >
        <Row gutter={8}>
          {/*<Col span={12}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} label="ID">
              {form.getFieldDecorator('roleId', {
                initialValue: updateRole.id,
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>*/}
          <Col span={12}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 12 }}
              label={intl.formatMessage({ id: 'roleMgt.roleName' })}
            >
              {form.getFieldDecorator('roleName', {
                initialValue: updateRole.roleName,
                rules: [
                  { required: true, message: intl.formatMessage({ id: 'roleMgt.inputRoleName' }) },
                  { validator: this.validRoleName },
                ],
              })(
                <Input
                  maxLength={60}
                  disabled={isEdit ? false : true}
                  placeholder={intl.formatMessage({ id: 'roleMgt.inputRoleName' })}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <FormItem
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 18 }}
              label={intl.formatMessage({ id: 'roleMgt.person' })}
            >
              {form.getFieldDecorator('users', {
                initialValue: targetKeys,
              })(
                <UserTransfer
                  isEdit={isEdit ? false : true}
                  onSelectUserChange={this.onSelectUserChange}
                  dispatch={this.props.dispatch}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              label={intl.formatMessage({ id: 'roleMgt.description' })}
            >
              {form.getFieldDecorator('description', {
                initialValue: updateRole.roleDesc,
                rules: [
                  {
                    required: false,
                    message: intl.formatMessage({ id: 'roleMgt.inputDescription' }),
                  },
                ],
              })(
                <TextArea
                  disabled={isEdit ? false : true}
                  placeholder={intl.formatMessage({ id: 'roleMgt.inputDescription' })}
                  maxLength={250}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default Form.create()(RoleUpdateModal);
