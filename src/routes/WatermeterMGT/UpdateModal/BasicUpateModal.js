import React from 'react';
import {  Form, Input, Select } from 'antd';
import FiveAddressCascader from "../../Components/FiveAddressCascader";

const ValveState = {
  OPEN: '开闸',
  DOWN: '关闸',
};
const TextArea = Input.TextArea;
const { Option } = Select;

const BasicUpdateModal = ({ record, waterPriceList, getFieldDecorator,validAddress }) => {

  const formItemLayout = {
    labelCol: { span: 4, offset: 1 },
    wrapperCol: { span: 14 },
  };

  return (
    <div>
      <Form layout="vertical">
        <Form.Item {...formItemLayout} label="">
          {getFieldDecorator('id', {
            initialValue: record.id,
          })(<Input disabled={true} type="hidden" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="水表账号">
          {getFieldDecorator('meterCode', {
            initialValue: record.meterCode,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled={true} placeholder="未获取账号码" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="用水性质">
          {getFieldDecorator('waterPriceId', {
            initialValue: record.waterPriceId,
          })(
            <Select placeholder="请选择" disabled={true}>
              {waterPriceList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.typeName}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="水表地址">
          {getFieldDecorator('waterMeterAddress', {
            initialValue: record.addressCode,
            rules: [
              {
                required: true,
                message: '选择水表地址',
              },
              {validator: validAddress},
            ],
          })(
            <FiveAddressCascader/>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="水表状态">
          {ValveState[record.meterState]}
        </Form.Item>
        <Form.Item {...formItemLayout} label="电信平台码">
          {record.deviceId ? record.deviceId : '非电信平台'}
        </Form.Item>
        <Form.Item {...formItemLayout} label="描述">
          {getFieldDecorator('description', {
            initialValue: record.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows="2" cols="30" placeholder="请输入" />)}
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicUpdateModal;
