import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal } from 'antd';

import RolePermissionSetTree from './RolePermissionSetTree';

import { injectIntl } from 'react-intl';

const FormItem = Form.Item;

@injectIntl
class RoleUpdateModal extends Component {
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
    } = this.props;
    const TreeProps = {
      expandedKeys,
      checkedKeys,
      autoExpandParent,
      treeData,
      onChange: keys => {
        form.setFieldsValue({ functions: keys });
      },
    };
    const { intl } = this.props;
    return (
      <Modal
        destroyOnClose={true}
        width={600}
        title={intl.formatMessage({ id: 'roleMgt.settingPermission' })}
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={handleModalVisible}
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

export default Form.create()(RoleUpdateModal);
