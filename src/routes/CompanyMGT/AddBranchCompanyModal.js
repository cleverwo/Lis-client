import React, { Component } from 'react';
import { Cascader, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import Position from "../../utils/AntCascader";

const FormItem = Form.Item;

@connect(({ company }) => ({
  company,
}))
@Form.create()
export default class AddBranchCompanyModal extends Component {
  // 提交按钮触发事件
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
    const { modalVisible, handleModalVisible } = this.props;
    const formItemLayout = {
      labelCol: { span: 5, offset: 1 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal
        title="子公司信息"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="分公司名称">
              {getFieldDecorator('name', {
                rules: [{ required : true}]
              })(<Input placeholder="输入分公司名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分公司地址">
              {getFieldDecorator('coAddress', {
                rules: [{
                  required:true,
                  message: '选择分公司地址'
                },],
              })(
                <Cascader
                  placeholder="请选择"
                  showSearch
                  options={Position}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', {
                rules: [{ required : true}]
              })(<Input placeholder="输入分公司详细地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="财务账号">
              {getFieldDecorator('companyAccount')(<Input placeholder="输入公司财务账号" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
