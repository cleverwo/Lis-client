import React, { Component } from 'react';
import { Form, Modal, Tabs } from 'antd';
import { connect } from 'dva/index';
import BasicUpdateModal from './UpdateModal/BasicUpateModal';
import MeterOperateModal from './UpdateModal/MeterOperateModal';
import OperateMeterPrice from "./UpdateModal/OperateMeterPrice";
import OperateMeterValve from "./UpdateModal/OperateMeterValve";

const TabPane = Tabs.TabPane;

@connect(({ waterPrice, waterMeter }) => ({
  waterPrice,
  waterMeter,
}))
class WaterMeterModal extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetchList',
    });
  }

  /* 水表地址校验*/
  validAddress = (rule, value,callback) => {
    if (value === undefined || value.length < 5) {
      return callback("地址需要精确到楼栋")
    }
    callback();
  };

  //提交按钮触发事件
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { waterMeter: { record }, onSubmit, handleModalVisible } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      let isModify =
        values.waterMeterAddress[0] !== record.meterProvince ||
        values.waterMeterAddress[1] !== record.meterCity ||
        values.waterMeterAddress[2] !== record.meterArea ||
        values.waterMeterAddress[3] !== record.meterCommunity + ""||
        values.waterMeterAddress[4] !== record.meterBlock + ""||
        values.description !== record.description;
      if (!isModify) {
        console.log('没有修改');
      } else {
        if (!err) {
          onSubmit(values);
        }
      }
      handleModalVisible();
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modalVisible,
      handleModalVisible,
      callBackRefresh,
      waterPrice: { waterPriceList },
      waterMeter: { record },
      isValve,
      isMeterPrice,
      isOtherCommand
    } = this.props;

    return (
      <Modal
        title="编辑水表"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible()}
        width="50%"
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <BasicUpdateModal
                record={record}
                waterPriceList={waterPriceList}
                getFieldDecorator={getFieldDecorator}
                validAddress={this.validAddress}
              />
            </TabPane>
            {isMeterPrice? (
              <TabPane tab="水表水价设置" key="2">
                <OperateMeterPrice record={record} waterPriceList={waterPriceList} callBackRefresh={callBackRefresh}/>
              </TabPane>
            ):""}
            {isValve? (
              <TabPane tab="水表阀门控制" key="3">
                <OperateMeterValve record={record} waterPriceList={waterPriceList} callBackRefresh={callBackRefresh}/>
              </TabPane>
            ):""}
            {isOtherCommand? (
              <TabPane tab="水表操作阀" key="4">
                <MeterOperateModal record={record} waterPriceList={waterPriceList} callBackRefresh={callBackRefresh}/>
              </TabPane>
            ):""}
          </Tabs>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(WaterMeterModal);
