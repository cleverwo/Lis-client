import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ person }) => ({
  person,
}))
class AdminModal extends Component {
  //提交按钮触发事件
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { onSubmit } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modalVisible,
      handleModalVisible,
      handleValid,
      person: { companyList, roleList },
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
    };

    // 判断登录名是否重复
    let checkLoginName = (rule, value, callback) => {
      handleValid(value, msg => {
        callback(msg);
      });
    };

    return (
      <Modal
        title="新建人员"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="初始密码">
              123456
            </FormItem>

            <FormItem {...formItemLayout} label="登录名">
              {getFieldDecorator('loginName', {
                rules: [
                  {
                    required: true,
                  },
                  { validator: checkLoginName },
                ],
                validateTrigger: 'onBlur',
              })(<Input placeholder="输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="联系电话">
              {getFieldDecorator('telephone', {
                rules: [
                  {
                    required: true,
                    message: '输入正确的手机号格式',
                    pattern: new RegExp('^1([38]\\d|5[0-35-9]|7[3678])\\d{8}$'),
                  },
                ],
                validateTrigger: 'onBlur',
              })(<Input placeholder="输入手机号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="所属公司">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {companyList.map(item => (
                    <Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>

            {/*<FormItem {...formItemLayout} label="所属角色">
              {getFieldDecorator('roleId', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {roleList.map(item => (
                    <Option key={item.roleId} value={item.roleId}>
                      {item.description}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>*/}
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(AdminModal);
