import React, { Component } from 'react';
import { Form, Input, Modal, message } from 'antd';
import StaircaseTableForm from './StaircaseTableForm';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ waterPrice }) => ({
  waterPrice,
}))
@Form.create()
export default class PriceStaircaseModal extends Component {
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { onSubmit } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        // 校验阶梯格式
        let lastStair = 0.0;
        let lastPrice = 0.0;
        let validate = true;
        for (let i in values.staircaseList) {
          if (values.staircaseList[i].endQuantity <= lastStair ||
            values.staircaseList[i].staircasePrice <= lastPrice) {
            validate = false;
          }
          lastStair = values.staircaseList[i].endQuantity;
          lastPrice = values.staircaseList[i].staircasePrice;
        }
        if (validate) {
          onSubmit(values);
        } else {
          message.error('阶梯数据必须不小于上一个阶梯');
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modalVisible,
      handleModalVisible,
      waterPrice: { waterPriceDetail: { priceId, priceName, additionalFee, composeList, staircaseList } },
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 14 },
    };

    return (
      <Modal
        title="阶梯水价"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <p>用水性质：{priceName}</p>
          <Form>
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('priceId', { initialValue: priceId })(
                <Input disabled={true} type="hidden" />
              )}
            </FormItem>
          </Form>
          <p>水费阶梯组成</p>
          {/*<p>(最后一个阶梯止量填写一个大于0的数字即可)</p>*/}
          <div>
            {getFieldDecorator('staircaseList', {
              initialValue: staircaseList,
            })(<StaircaseTableForm fee={additionalFee} />)}
          </div>
        </div>
      </Modal>
    );
  }
}
