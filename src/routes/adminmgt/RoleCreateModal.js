import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal } from 'antd';
import { connect } from 'dva/index';
import UserTransfer from './UserTransfer';
import { injectIntl } from 'react-intl';

const FormItem = Form.Item;

const { TextArea } = Input;

@connect(({ enumeration, role }) => ({
  enumeration,
  role,
}))
@injectIntl
class RoleCreateModal extends Component {
  constructor(props) {
    super(props);
  }

  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.handleAdd(fieldsValue, form);
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
    const { handleValidRoleName } = this.props;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (value === undefined || value.trim() === '') {
      callback();
      return;
    }
    this.timeout = setTimeout(() => {
      return handleValidRoleName(value, callback);
    }, 300);
  };

  render() {
    const { form, handleModalVisible } = this.props;
    const { role: { createModalVisible } } = this.props;
    const { intl } = this.props;
    return (
      <Modal
        destroyOnClose={true}
        width={1000}
        title={intl.formatMessage({ id: 'roleMgt.createRole' })}
        visible={createModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        afterClose={this.clearUserTransfer}
        maskClosable={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 12 }}
              label={intl.formatMessage({ id: 'roleMgt.roleName' })}
            >
              {form.getFieldDecorator('roleName', {
                rules: [
                  { required: true, message: intl.formatMessage({ id: 'roleMgt.inputRoleName' }) },
                  { validator: this.validRoleName },
                ],
              })(
                <Input
                  maxLength={60}
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
              {form.getFieldDecorator('users')(
                <UserTransfer
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
                rules: [
                  {
                    required: false,
                    message: intl.formatMessage({ id: 'roleMgt.inputDescription' }),
                  },
                ],
              })(
                <TextArea
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

export default Form.create()(RoleCreateModal);
