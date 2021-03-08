import React from 'react';
import { Divider, Table } from 'antd';

const MeterOperateForm = ({ data }) => {
  console.log('操作记录表', data);

  const columns = [
    {
      title: '操作名称',
      dataIndex: 'operateType',
      key: 'operateType',
    },
    {
      title: '操作内容',
      dataIndex: 'operateData',
      key: 'operateData',
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
      查询框位置
      <Divider style={{ margin: '24px 0' }} />
      <Table columns={columns} dataSource={data} rowKey={record => record.id} />
    </div>
  );
};

export default MeterOperateForm;
