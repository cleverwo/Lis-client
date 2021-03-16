import React, { Component } from 'react';
import { Form, Modal, Tabs, Row, Col } from 'antd';
import { connect } from 'dva/index';
import FooterToolbar from '@/components/FooterToolbar';

const TabPane = Tabs.TabPane;

@connect(({ sample }) => ({
  sample,
}))
class ApplicationForm extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'waterPrice/fetchList',
    // });
  }

  /* 水表地址校验*/
  validAddress = (rule, value, callback) => {
    if (value === undefined || value.length < 5) {
      return callback('地址需要精确到楼栋');
    }
    callback();
  };

  //提交按钮触发事件
  okHandler = e => {
    const { validateFields } = this.props.form;
    const { sample: { record }, onSubmit, handleModalVisible } = this.props;
    handleModalVisible();
    // e.preventDefault();
    // validateFields((err, values) => {
    //   let isModify =
    //     values.sampleAddress[0] !== record.meterProvince ||
    //     values.sampleAddress[1] !== record.meterCity ||
    //     values.sampleAddress[2] !== record.meterArea ||
    //     values.sampleAddress[3] !== record.meterCommunity + ""||
    //     values.sampleAddress[4] !== record.meterBlock + ""||
    //     values.description !== record.description;
    //   if (!isModify) {
    //     console.log('没有修改');
    //   } else {
    //     if (!err) {
    //       onSubmit(values);
    //     }
    //   }
    //   handleModalVisible();
    // });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      modalVisible,
      handleModalVisible,
      callBackRefresh,
      sample: { record },
    } = this.props;

    return (
      <Modal
        title="检验申请"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible()}
        width="70%"
        destroyOnClose={true}
        maskClosable={false}
      >

        <Row gutter={16}>
          <Col span={15}>

          </Col>
          <Col span={9}>

          </Col>
        </Row>
        {/*<Tabs defaultActiveKey="1">
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
          </Tabs>*/}
      </Modal>
    );
  }
}

export default Form.create()(ApplicationForm);
