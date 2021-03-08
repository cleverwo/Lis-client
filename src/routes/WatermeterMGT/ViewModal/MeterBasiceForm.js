import React from 'react';
import { Divider } from 'antd';
import DescriptionList from '../../../components/DescriptionList/index';
import moment from "moment";

const { Description } = DescriptionList;
const valveState = {
  OPEN: '开阀',
  DOWN: '关闸',
};

const MeterBasicForm = ({ record, customer }) => {
  return (
    <div>
      <DescriptionList size="small" style={{ marginBottom: 22 }} col={2}>
        <Description term="水表账号">{record.meterCode}</Description>
        <Description term="水表状态">
          {(() => {
            if (record.meterValve === 'Y') {
               return valveState[record.meterState];
            }
            return valveState["OPEN"];
          })()}
        </Description>
        <Description term="计费方式">
          {record.waterPrice ? record.waterPrice : '无'}
        </Description>
        <Description term="水费余额">
          {record.waterBalance}元({record.toBeCharge}元)
        </Description>
        <Description term="待充值水费余额">{record.toBeCharge}元</Description>
        <Description term="结算日累计流量">{record.waterFlow}m³</Description>
       {/* <Description term="结算日期类型">
          {record.settlementType ? record.settlementType : '暂无数据'}
        </Description>
        <Description term="结算日期">
          {record.settlementDate ? record.settlementDate : '暂无数据'}
        </Description>*/}
      </DescriptionList>
      <DescriptionList size="small" style={{ marginBottom: 22 }} col={1}>
        <Description term="水表地址">{record.address}</Description>
        <Description term="开户营业厅">{record.hallName}</Description>
        <Description term="描述">{record.description?record.description: "无"}</Description>
        <Description term="水表录入时间">{moment(record.createTime).format('YYYY-MM-DD HH:mm')}</Description>
        <Description term="上次通信时间">{moment(record.updateTime).format('YYYY-MM-DD HH:mm')}</Description>
        <Description term="所属平台">{record.deviceId ? "电信平台" : '本地平台'}</Description>
      </DescriptionList>
      <Divider style={{ margin: '24px 0' }} />
      <DescriptionList size="small" style={{ marginBottom: 22 }} col={2}>
        <Description term="所属用户">{record.customerName? record.customerName: "无用户"}</Description>
        <Description term="用户手机号">{record.customerPhone}</Description>
      </DescriptionList>
    </div>
  );
};

export default MeterBasicForm;
