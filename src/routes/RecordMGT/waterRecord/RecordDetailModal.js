import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import StandardTable from "../../../components/StandardTable";
import Button from "antd/es/button";

@connect(({waterRecord}) => ({
  waterRecord,
}))
export default class RecordDetailModal extends Component {

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch, waterRecord: {formValues, meterId}} = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      meterId: meterId,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'waterRecord/fetchDetail',
      payload: params,
    });
  };

  handleClose = () => {
    const { dispatch, handleModalVisible } = this.props;
    dispatch({
      type: 'waterRecord/saveDetailData',
      payload: {
        list: [],
        pagination: {},
      },
    });
    dispatch({
      type: 'waterRecord/setMeterId',
      payload: 0,
    });
    handleModalVisible(false);
  };

  render() {
    const { loading, modalVisible, waterRecord: { detailData} } = this.props;

    const columns = [
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用水量',
        dataIndex: 'waterVolume',
        key: 'waterVolume',
        render: val => (val === undefined ? '未获得数据' :`${val}吨` ),
      },
      {
        title: '金额',
        dataIndex: 'consumePrice',
        key: 'consumePrice',
        render: val => (val === undefined ?  '未获得数据' : `${val}元` ),
      },
      {
        title: '余额',
        dataIndex: 'balance',
        key: 'balance',
        render: val => (val === undefined ?  '未获得数据' : `${val}元` ),
      },
      {
        title: '水价类型',
        dataIndex: 'waterType',
        key: 'waterType',
      },
      {
        title: '记录时间',
        dataIndex: 'recordDate',
        key: 'recordDate',
      },
    ];

    return (
      <Modal
        title="用水详情"
        visible={modalVisible}
        onCancel={this.handleClose}
        onOk={this.handleClose}
        destroyOnClose={true}
        width={700}
        footer={[
          <Button key="submit" type="primary" loading={loading} onClick={this.handleClose}>
            确定
          </Button>
        ]}
      >
        <StandardTable
          selectedRows={[]}
          loading={loading}
          data={detailData}
          columns={columns}
          rowKey={record => record.recordId}
          onChange={this.handleStandardTableChange}
          noSelect={ true }
        />
      </Modal>
    )
  }

}
