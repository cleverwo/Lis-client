import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
import TableForm from './PriceComposeTableForm';

const FormItem = Form.Item;

@Form.create()
export default class WaterPriceModal extends Component {
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
    const { modalVisible, handleModalVisible, handleValid } = this.props;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
    };

    // 判断水价名称是否重复
    let checkPriceName = (rule, value, callback) => {
      handleValid(value, msg => {
        callback(msg);
      });
    };

    return (
      <Modal
        title="水价信息"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="用水性质">
              {getFieldDecorator('priceTypeName', {
                rules: [{ required: true }, { validator: checkPriceName }],
                validateTrigger: 'onBlur',
              })(<Input placeholder="输入用水性质" />)}
            </FormItem>
          </Form>
          <p>附加费用</p>
          <div>
            {getFieldDecorator('priceCompose', {
              initialValue: [],
            })(<TableForm />)}
          </div>
        </div>
      </Modal>
    );
  }
}
