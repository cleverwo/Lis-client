import React, { Component } from 'react';
import { Form, Input, Modal } from 'antd';
import TableForm from './PriceComposeTableForm';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ waterPrice }) => ({
  waterPrice,
}))
@Form.create()
export default class EditWaterPriceModal extends Component {
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
    const {
      modalVisible,
      handleModalVisible,
      waterPrice: { waterPriceDetail: { priceId, priceName, composeList, staircaseList } },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
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
              {getFieldDecorator('priceTypeName', { initialValue: priceName })(
                <Input placeholder="输入用水性质" />
              )}
            </FormItem>
          </Form>
          <p>附加费用</p>
          <div>
            {getFieldDecorator('priceCompose', {
              initialValue: composeList,
            })(<TableForm />)}
          </div>
          <FormItem {...formItemLayout} label="">
            {getFieldDecorator('priceId', { initialValue: priceId })(
              <Input disabled={true} type="hidden" />
            )}
          </FormItem>
        </div>
      </Modal>
    );
  }
}
