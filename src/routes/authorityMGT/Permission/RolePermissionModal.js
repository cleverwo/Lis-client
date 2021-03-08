import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal } from 'antd';

import RolePermissionSetTree from './RolePermissionSetTree';

const FormItem = Form.Item;

class RolePermissionModal extends Component {
  constructor(props) {
    super(props);
  }

  okHandle = () => {
    const { form, updateRole } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue['roleId'] = updateRole.id;
      this.props.handleUpdate(fieldsValue, form);
    });
  };

  onSelectUserChange = selectedUsers => {
    const { form } = this.props;
    form.setFieldsValue({
      permissions: selectedUsers,
    });
  };

  render() {
    const {
      form,
      handleModalVisible,
      updateModalVisible,
      updateRole,
      expandedKeys,
      checkedKeys,
      autoExpandParent,
      treeData,
      isEdit,
    } = this.props;

    const TreeProps = {
      isEdit,
      expandedKeys,
      checkedKeys,
      autoExpandParent,
      treeData,
      onChange: keys => {
        form.setFieldsValue({ functions: keys });
      },
    };

    return (
      <Modal
        destroyOnClose={true}
        width={600}
        title="设置权限"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={handleModalVisible}
        maskClosable={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="角色名称">
              {form.getFieldDecorator('roleName', {
                initialValue: updateRole.roleName,
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>

        <FormItem>
          {form.getFieldDecorator('functions', {
            initialValue: checkedKeys,
          })(<RolePermissionSetTree {...TreeProps} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(RolePermissionModal);
