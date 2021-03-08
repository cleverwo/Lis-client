import React, { Component } from 'react';
import { Form, Modal, Select } from 'antd';
import { connect } from 'dva/index';

const Option = Select.Option;

@connect(({ waterMeter }) => ({
  waterMeter,
}))
class WaterMeterRequestModal extends Component {
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { dispatch, waterMeter: { history }, handleModalVisible } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: history.id,
            operType: values.dataType,
          },
        });
        handleModalVisible(false);
      }
    });
  };

  render() {
    const { modalVisible, handleModalVisible } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        title="请求数据结果"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <Form.Item label="请求日期类型">
              {getFieldDecorator('dataType', {
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  <Option key="05" value="05">
                    近一年的历史数据
                  </Option>
                  <Option key="06" value="06">
                    结算日1~20天历史数据
                  </Option>
                  <Option key="07" value="07">
                    结算日21~40天历史数据
                  </Option>
                  <Option key="08" value="08">
                    结算日41~60天历史数据
                  </Option>
                  <Option key="09" value="09">
                    结算日61~80天历史数据
                  </Option>
                  <Option key="10" value="10">
                    结算日81~100天历史数据
                  </Option>
                  <Option key="11" value="11">
                    结算日101~120天历史数据
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(WaterMeterRequestModal);
