import React, { Component } from 'react';
import {Form, Input, Select, Modal, Cascader} from 'antd';
import { connect } from 'dva';
import Position from "../../utils/AntCascader";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ company }) => ({
  company,
}))
@Form.create()
export default class EditHallModal extends Component {
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
    const { modalVisible, handleModalVisible, company: { branchCoList, record } } = this.props;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
    };

    let defaultAddr = [record.province, record.city, record.area];

    return (
      <Modal
        title="服务大厅信息"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible({}, false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('id', { initialValue: record.coId })(
                <Input disabled={true} type="hidden" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={'所属公司'} required={true}>
              {getFieldDecorator('parentCompanyId', { initialValue: record.superiorId })(
                <Select>
                  {branchCoList.map(item => (
                    <Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="大厅名称" required={true}>
              {getFieldDecorator('name', { initialValue: record.coName })(
                <Input placeholder="输入服务大厅名称" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="大厅地址" required={true}>
              {getFieldDecorator('coAddress', {
                initialValue: defaultAddr,
                rules: [{
                  required:true,
                  message: '选择大厅地址'
                }]
              })(
                <Cascader
                  placeholder="请选择"
                  showSearch
                  options={Position}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址" required={true}>
              {getFieldDecorator('address', { initialValue: record.address })(
                <Input placeholder="输入大厅详细地址" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="财务账号">
              {getFieldDecorator('companyAccount', { initialValue: record.coAccount })(
                <Input placeholder="输入大厅财务账号" />
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
