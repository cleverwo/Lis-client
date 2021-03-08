import React, { Component } from 'react';
import { Divider, Modal, Table, Row, Col } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import { connect } from 'dva';

const { Description } = DescriptionList;

@connect(({ waterPrice }) => ({
  waterPrice,
}))
export default class ViewWaterPriceModal extends Component {
  handleClose = () => {
    const { dispatch, handleModalVisible } = this.props;
    dispatch({
      type: 'waterPrice/setPriceDetail',
      payload: {
        priceId: 0,
        priceName: '',
        composeList: [],
        staircaseList: [],
      },
    });
    handleModalVisible(false);
  };

  render() {
    const {
      loading,
      handleModalVisible,
      modalVisible,
      waterPrice: { waterPriceDetail: { priceId, priceName, additionalFee, composeList, staircaseList } },
    } = this.props;
    const composeColumns = [
      // {
      //   title: '序号',
      //   dataIndex: 'composeId',
      //   key: 'composeId',
      // },
      {
        title: '费用名称',
        dataIndex: 'composeName',
        key: 'composeName',
      },
      {
        title: '费用金额',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => {
          text = text + '元';
          return text;
        },
      },
    ];
    const priceColumns = [
      {
        title: '阶梯',
        dataIndex: 'index',
        key: 'index',
        render: (text, record) => {
          let index = staircaseList.indexOf(record) + 1;
          return '第' + index + '阶梯';
        },
      },
      {
        title: '阶梯止量',
        dataIndex: 'endQuantity',
        key: 'endQuantity',
        render: (text, record) => {
          text = text + 'm³';
          return text;
        },
      },
      {
        title: '阶梯基础价格',
        dataIndex: 'staircasePrice',
        key: 'staircasePrice',
        render: (text, record) => {
          text = text + '元';
          return text;
        },
      },
      {
        title: '阶梯合计',
        dataIndex: 'sum',
        key: 'sum',
        render: (text, record) => {
          text = text + '元';
          return text;
        },
      },
    ];
    return (
      <Modal
        title="水价详情"
        visible={modalVisible}
        onOk={() => this.handleClose()}
        onCancel={() => this.handleClose()}
        destroyOnClose={true}
        maskClosable={false}
      >
        <p>用水性质：{priceName}</p>
        <Divider style={{ marginBottom: 32 }} />
        <p>附加费用</p>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          dataSource={composeList}
          columns={composeColumns}
          rowKey="composeId"
        />
        <Row>
          <Col span={8} offset={16}>附加费用合计：{additionalFee}元</Col>
        </Row>
        <Divider style={{ marginBottom: 32 }} />
        <p>阶梯水价</p>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          dataSource={staircaseList}
          columns={priceColumns}
          rowKey="staircaseId"
        />
      </Modal>
    );
  }
}
