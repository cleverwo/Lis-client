import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { connect } from 'dva/index';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ customer }) => ({
  customer,
  data: customer.record,
}))
class CustomerModal extends Component {
  //提交按钮触发事件
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { data, onSubmit } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      let isModify =
        values.name !== data.name ||
        values.phone !== data.phone ||
        values.certificateNumber !== data.certificateNumber;
      if (!isModify) {
        console.log('没有修改');
      } else {
        if (!err) {
          const record = {
            ...values,
            certificateType: data.certificateType,
          };
          onSubmit(record);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { modalVisible, handleModalVisible, data } = this.props;
    return (
      <Modal
        title="编辑用户信息"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible()}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('id', {
                initialValue: data.id,
              })(<Input disabled={true} type="hidden" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="用户名称">
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  {
                    required: true,
                    max: 4,
                    min: 2,
                    message: '长度为2~4字符',
                  },
                ],
              })(<Input placeholder="输入用户名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="证件类型">
              <Input.Group compact>
                <Select
                  defaultValue={data.certificateType}
                  style={{ width: 100 }}
                  onChange={value => {
                    this.props.dispatch({
                      type: 'customer/setCertificateType',
                      payload: value ? value : 'IDCARD',
                    });
                  }}
                >
                  <Option value="IDCARD">身份证</Option>
                  <Option value="PASSPORT">驾驶证</Option>
                  <Option value="OTHER">其他</Option>
                </Select>
                {getFieldDecorator('certificateNumber', {
                  initialValue: data.certificateNumber,
                  rules: [
                    {
                      required: true,
                      message: '输入正确的证件号',
                      pattern: new RegExp(
                        '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'
                      ),
                    },
                  ],
                })(<Input style={{ width: 'calc(100% - 100px)' }} placeholder="输入证件号码" />)}
              </Input.Group>
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('phone', {
                initialValue: data.phone,
                rules: [
                  {
                    required: true,
                    message: '输入正确的手机号格式',
                    pattern: new RegExp('^1([38]\\d|5[0-35-9]|7[3678])\\d{8}$'),
                  },
                ],
              })(<Input placeholder="输入手机号" maxLength={11}/>)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(CustomerModal);
