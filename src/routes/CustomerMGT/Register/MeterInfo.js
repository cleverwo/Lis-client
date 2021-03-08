import React, { PureComponent }from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Divider, message, Select, Modal} from 'antd';
import {routerRedux} from 'dva/router';
import styles from './style.less';

const Option = Select.Option;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({form, loading, customer, meter}) => ({
  submitting: loading.effects['form/submitStepForm'],
  customerData: customer.customerInfo,
  meterData: meter.record,
  customer,
}))
@Form.create()
export default class MeterInfo extends PureComponent {

  //上一步
  onPrev = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'meter/setRecord',
      payload: {},
    });
    dispatch(routerRedux.push('/customer/register/selectMeter'));
  };

  //完成
  onValidateForm = e => {
    const {validateFields} = this.props.form;
    const {dispatch,meterData} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (values.meterCode === undefined) {
        message.info('未能获取水表Id,重新选择');
        return;
      }
      if (!err) {
        Modal.confirm({
          title: '确定开户吗?',
          content: '',
          onOk() {
            dispatch({
              type: 'customer/add',
              payload: {
                ...values,
                addressCode: meterData.addressCode
              },
            });
          },
          okText: '确定',
          cancelText: '取消',
        });
      }
    });
  };

  render() {
    const {customerData, submitting, form, meterData} = this.props;
    const {getFieldDecorator} = form;

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="用户姓名">
          {getFieldDecorator('name', {
            initialValue: customerData.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="用户证件类型">
          {getFieldDecorator('certificateType', {
            initialValue: customerData.certificateType,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select disabled={true}>
              <Option key="IDCARD" value="IDCARD">
                身份证
              </Option>
              <Option key="PASSPORT" value="PASSPORT">
                驾驶证
              </Option>
              <Option key="OTHER" value="OTHER">
                其他
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="用户证件号">
          {getFieldDecorator('certificateNumber', {
            initialValue: customerData.certificateNumber,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="手机号">
          {getFieldDecorator('phone', {
            initialValue: customerData.phone,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input disabled={true}/>)}
        </Form.Item>

        <Divider style={{margin: '24px 0'}}/>
        <Form.Item {...formItemLayout} label="">
          {getFieldDecorator('waterId', {
            initialValue: meterData.id,
          })(<Input disabled={true} type="hidden"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="水表号">
          {getFieldDecorator('meterCode', {
            initialValue: meterData.meterCode,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="未获取水表号,重新选择" disabled={true}/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="当前水费余额">
          {meterData.waterBalance} ￥
        </Form.Item>
        <Form.Item
          style={{marginBottom: 8}}
          wrapperCol={{
            xs: {span: 24, offset: 0},
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={this.onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={this.onPrev} style={{marginLeft: 8}}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
