import React, { Component } from 'react';
import {Cascader, Form, Input, Modal} from 'antd';
import { connect } from 'dva';
import Position from "../../utils/AntCascader";

const FormItem = Form.Item;

@connect(({ company }) => ({
  company,
}))
@Form.create()
export default class EditBranchCompanyModal extends Component {
  // 提交按钮触发事件
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { onSubmit, company: { record } } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      let isModify =
        values.coName !== record.coName ||
        values.province !== record.province ||
        values.city !== record.city ||
        values.area !== record.area ||
        values.address !== record.address ||
        values.coAccount !== record.coAccount;
      if (!isModify) {
        console.log('没有修改');
      } else {
        if (!err) {
          onSubmit(values);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, handleModalVisible, company: { record } } = this.props;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
    };

    let defaultAddr = [record.province, record.city, record.area];

    return (
      <Modal
        title="子公司信息"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible({}, false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <Form.Item {...formItemLayout} label="">
              {getFieldDecorator('id', { initialValue: record.coId })(
                <Input disabled={true} type="hidden" />
              )}
            </Form.Item>
            <FormItem {...formItemLayout} label="分公司名称">
              {getFieldDecorator('name', { initialValue: record.coName })(
                <Input placeholder="输入分公司名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="公司地址" required={true}>
              {getFieldDecorator('coAddress', {
                initialValue: defaultAddr,
                rules: [{
                  required:true,
                  message: '选择公司地址'
                }]
              })(
                <Cascader
                  placeholder="请选择"
                  showSearch
                  options={Position}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址">
              {getFieldDecorator('address', { initialValue: record.address })(
                <Input placeholder="输入分公司详细地址" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="财务账号">
              {getFieldDecorator('companyAccount', { initialValue: record.coAccount })(
                <Input placeholder="输入公司财务账号" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
