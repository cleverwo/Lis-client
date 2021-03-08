import React, { Component } from 'react';
import { Form, Modal, Tabs } from 'antd';
import { connect } from 'dva/index';
import BasicForm from './BasicForm';
import BasicMeterForm from "./BasicMeterForm";

const TabPane = Tabs.TabPane;

@connect(({ customer }) => ({
  customer,
}))
class ViewModal extends Component {
  render() {
    const { modalVisible, handleModalVisible, customer: { record } } = this.props;
    return (
      <Modal
        title="查看用户详细信息"
        visible={modalVisible}
        onCancel={() => handleModalVisible(false)}
        width="50%"
        destroyOnClose={true}
        footer={null}
      >
        <Form>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <BasicForm record={record} />
            </TabPane>
            <TabPane tab="水表信息" key="2">
              <BasicMeterForm record={record.meters? record.meters: []} />
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ViewModal);
