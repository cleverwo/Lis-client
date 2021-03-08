import { Component } from 'react';
import { Col, Modal, Row, Form } from 'antd';
import UserTransfer from '../../adminmgt/UserTransfer';
import React from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ userTransfer, role }) => ({
  userTransfer,
  role,
}))
@Form.create()
export default class RoleUserModal extends Component {
  okHandle = () => {
    const { form, onSubmit } = this.props;
    const { role: { updateRole } } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue['roleId'] = updateRole.id;
      console.log('提交的值:', fieldsValue);
      onSubmit(fieldsValue, form);
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

  render() {
    const {
      modalVisible,
      handleModalVisible,
      isEdit,
      userTransfer: { targetKeys },
      form,
    } = this.props;

    return (
      <Modal
        width={1000}
        title="设置人员"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        afterClose={this.clearUserTransfer}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Row gutter={8}>
          <Col span={24}>
            <FormItem labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} label="设置人员">
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
      </Modal>
    );
  }
}
