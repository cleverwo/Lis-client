import React, { Component } from 'react';
import { Row, Col, Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(({ enumeration, role }) => ({
  enumeration,
  role,
}))
@Form.create()
export default class RoleCreateModal extends Component {
  constructor(props) {
    super(props);
  }

  /* 新建确定 */
  okHandle = () => {
    const { onSubmit } = this.props;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(fieldsValue, form);
    });
  };

  /* 角色名称校验*/
  timeout;
  validRoleName = (rule, value, callback) => {
    const { handleValid } = this.props;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (value === undefined || value.trim() === '') {
      callback();
      return;
    }
    this.timeout = setTimeout(() => {
      return handleValid(value, callback);
    }, 300);
  };

  render() {
    const { form, handleModalVisible, modalVisible } = this.props;
    return (
      <Modal
        title="新建角色"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        destroyOnClose={true}
        maskClosable={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="角色名称">
              {form.getFieldDecorator('roleName', {
                rules: [
                  { required: true, message: '角色名称不能为空' },
                  { validator: this.validRoleName },
                ],
              })(<Input maxLength={60} placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label={'所属公司'}>
              {form.getFieldDecorator('coLevel', {
                initialValue: '0',
              })(
                <Select style={{ width: 130 }}>
                  <Option value="0">总公司</Option>
                  <Option value="1">分公司</Option>
                  <Option value="2">服务大厅</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="角色描述">
              {form.getFieldDecorator('description', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<TextArea placeholder="请输入" maxLength={250} />)}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}
