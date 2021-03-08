import React from 'react';
import { Table } from 'antd';

const MeterRequestForm = ({ data }) => {
  const columns = [
    {
      title: '操作名称',
      dataIndex: 'operateType',
      key: 'operateType',
    },
    {
      title: '操作顺序码',
      dataIndex: 'operOrder',
      key: 'operOrder',
    },
    {
      title: '操作是否完成',
      dataIndex: 'isFinished',
      key: 'isFinished',
      render: text => (text === 'N' ? '否' : '是'),
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} rowKey={record => record.id} />
    </div>
  );
};

export default MeterRequestForm;
