import React, { Component } from 'react';
import { Form, Modal, Tabs } from 'antd';
import { connect } from 'dva/index';
import MeterBasicForm from './ViewModal/MeterBasiceForm';
import MeterOperateForm from './ViewModal/MeterOperateForm';
import MeterRequestForm from './ViewModal/MeterRequestForm';

const TabPane = Tabs.TabPane;

@connect(({ waterMeter }) => ({
  waterMeter,
}))
class WaterMeterViewModal extends Component {
  render() {
    const {
      modalVisible,
      handleModalVisible,
      waterMeter: { record, operateList, requestList },
    } = this.props;
    const customer = record.customer;

    return (
      <Modal
        title="查看详细信息"
        visible={modalVisible}
        onCancel={() => handleModalVisible(false)}
        width="70%"
        destroyOnClose={true}
        footer={null}
      >
        <div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <MeterBasicForm record={record} customer={customer} />
            </TabPane>
            <TabPane tab="操作信息" key="2">
              <MeterOperateForm data={operateList} />
            </TabPane>
            <TabPane tab="请求信息" key="3">
              <MeterRequestForm data={requestList} />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(WaterMeterViewModal);
