import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Select, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const TextArea = Input.TextArea;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const { Option } = Select;

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
export default class PayMoney extends React.PureComponent {
  onPrev = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/customer/topUp/payBefore'));
  };

  onValidateForm = e => {
    const { validateFields } = this.props.form;
    const { dispatch, customer: { record } } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        //缴费记录参数
        const payRecord = {
          meterId: record.id,
          payType: values.payType,
          payAmount: values.addPrice,
          payOrRefund: 'PAY',
        };
        Modal.confirm({
          title: '确认充值信息',
          content: (
            <div>
              <span>水表编号：{values.meterCode}</span><br/>
              <span>用户姓名：{record.customerName}</span><br/>
              <span>充值金额：{values.addPrice}元</span>
            </div>
          ),
          onOk() {
            dispatch({
              type: 'customer/reCharges',
              payload: {
                ...values,
                payRecordOffline: payRecord,
              },
            });
            dispatch({
              type: 'customer/saveCustomer',
              payload: {
                ...record,
                ...values,
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
    const { form, customer: { record } } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{ marginBottom: 24 }}
        />
        <Form.Item {...formItemLayout} label="">
          {getFieldDecorator('waterId', {
            initialValue: record.id,
          })(<Input disabled={true} type="hidden" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="水表编号">
          {getFieldDecorator('meterCode', {
            initialValue: record.meterCode,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="未获取水表编号" disabled={true} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="用户姓名">
          {record.customerName}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="账户余额">
          {record.waterBalance}元
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="待充值余额">
          {record.toBeCharge}元
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item {...formItemLayout} label="充值金额">
          {getFieldDecorator('addPrice', {
            rules: [
              {
                required: true,
                message: "充值金额不能为空！"
              },
            ],
          })(<Input placeholder="充值余额" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="缴费方式">
          {getFieldDecorator('payType', {
            rules: [
              {
                required: true,
                message:"缴费方式不能为空！"
              },
            ],
          })(
            <Select placeholder="选择缴费方式标准">
              <Option key="ZHIFUBAO" value="ZHIFUBAO">
                支付宝
              </Option>
              <Option key="WEIXIN" value="WEIXIN">
                微信
              </Option>
              <Option key="CASH" value="CASH">
                现金
              </Option>
              <Option key="BANK_CARD" value="BANK_CARD">
                银联
              </Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="备注：">
          {getFieldDecorator('description')(<TextArea maxLength={200} placeholder="空" />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={this.onValidateForm}>
            提交
          </Button>
          <Button onClick={this.onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
