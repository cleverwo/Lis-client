import React, { Component } from 'react';
import { Modal } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import { connect } from 'dva';
import moment from 'moment';

const { Description } = DescriptionList;

@connect(({ alarm }) => ({
  alarm,
}))
export default class AlarmDetailModal extends Component {
  render() {
    const { modalVisible, handleModalVisible, alarm: { record } } = this.props;

    return (
      <Modal
        title="报警信息"
        visible={modalVisible}
        onCancel={() => handleModalVisible({}, false)}
        onOk={() => handleModalVisible({}, false)}
        destroyOnClose={true}
      >
        <div>
          <DescriptionList title="报警详细信息" col={1}>
            <Description term="水表编号">{record.meterCode}</Description>
            <Description term="地址">{record.cusAddress}</Description>
            <Description term="报警日期">
              {moment(record.alarmDate).format('YYYY-MM-DD HH:mm:ss')}
            </Description>
            <Description term="报警类型码">{record.alarmCode}</Description>
            <Description term="报警信息">{record.alarmInfo}</Description>
            <Description term="警报状态">{record.alarmState}</Description>
          </DescriptionList>
        </div>
      </Modal>
    );
  }
}
