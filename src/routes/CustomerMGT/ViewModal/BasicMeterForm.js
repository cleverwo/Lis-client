import React, {PureComponent} from 'react';
import DescriptionList from '../../../components/DescriptionList/index';
import {Divider} from "antd";

const { Description } = DescriptionList;

class BasicMeterForm extends PureComponent{
  render() {
    const {record} =this.props;
    console.log(record)
    const viewMeter = [];
    for (let meter of record){
      viewMeter.push(
        <div key={meter.meterCode}>
          <DescriptionList size="small" style={{ marginBottom: 22 }} col={2}>
            <Description term="水表账号">{meter.meterCode}</Description>
            <Description term="计费方式">{meter.waterPrice ?  meter.waterPrice: '未设置'}</Description>
            <Description term="水费余额">{meter.waterBalance}元</Description>
            <Description term="代充值余额">{meter.toBeCharge}元</Description>
            <Description term="结算日累计流量">{meter.waterFlow}m³</Description>
          </DescriptionList>
          <DescriptionList size="small" style={{ marginBottom: 22 }} col={1}>
            <Description term="水表地址">{meter.address}</Description>
            <Description term="详细地址">{meter.description?meter.description:'暂无'}</Description>
            <Description term="开户营业厅">{meter.hallName}</Description>
          </DescriptionList>
          <Divider style={{margin: '24px 0'}} />
        </div>
      )
    }
    return (
      <div>{viewMeter}</div>
    );
  }
}
export default BasicMeterForm;
