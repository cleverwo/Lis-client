import React, { Component } from 'react';
import { Modal } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import { connect } from 'dva';

const { Description } = DescriptionList;

@connect(({ company }) => ({
  company,
}))
export default class ViewCompanyModal extends Component {
  render() {
    const { modalVisible, handleModalVisible, company: { record } } = this.props;

    return (
      <Modal
        title="公司信息"
        visible={modalVisible}
        onCancel={() => handleModalVisible({}, false)}
        onOk={() => handleModalVisible({}, false)}
        destroyOnClose={true}
      >
        <div>
          <DescriptionList title="公司信息" col={1}>
            <Description term="公司名称">{record.coName}</Description>
            <Description term="上级公司名称">{record.superiorCo}</Description>
            <Description term="公司地址">{record.location}</Description>
            <Description term="详细地址">{record.address}</Description>
            <Description term="财务账号">{record.coAccount}</Description>
          </DescriptionList>
        </div>
      </Modal>
    );
  }
}
