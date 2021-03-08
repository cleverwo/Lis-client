import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
@connect(({ customer }) => ({
  customer,
  data: customer.customerInfo,
}))
@Form.create()
export default class CustomerInfo extends React.PureComponent {

  //下一步
  onValidateForm = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'customer/setCustomerInfo',
          payload: values,
        });
        dispatch(routerRedux.push('/customer/register/selectMeter'));
      }
    });
  };

  /* 手机号校验*/
/*  timeout;
  validCustomerPhone = (rule, value, callback) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (value === undefined || value.trim() === '') {
      callback();
      return;
    }
    this.timeout = setTimeout(() => {
      return this.validPhone(value, callback);
    }, 300);
  };*/

  /* 校验用户手机号唯一性 */
/*  validPhone = (value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/validPhone',
      payload: value,
      callback: callback,
    });
  };*/

  render() {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item {...formItemLayout} label="用户姓名">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [
                {
                  required: true,
                  max: 4,
                  min: 2,
                  message: '长度为2~4字符',
                },
              ],
            })(<Input placeholder="输入用户名称" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="证件类型">
            <Input.Group compact>
              <Select
                defaultValue={data.certificateType}
                style={{ width: 100 }}
                onChange={value => {
                  this.props.dispatch({
                    type: 'customer/setCertificateType',
                    payload: value ? value : 'IDCARD',
                  });
                }}
              >
                <Option value="IDCARD">身份证</Option>
                <Option value="PASSPORT">驾驶证</Option>
                <Option value="OTHER">其他</Option>
              </Select>
              {getFieldDecorator('certificateNumber', {
                initialValue: data.certificateNumber,
                rules: [
                  {
                    required: true,
                    message: '输入正确的证件号',
                    pattern: new RegExp(
                      '^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$'
                    ),
                  },
                ],
              })(<Input style={{ width: 'calc(100% - 100px)' }} placeholder="输入证件号码" />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: data.phone,
              rules: [
                {
                  required: true,
                  message: '输入正确的手机号格式',
                  pattern: new RegExp('^1([38]\\d|5[0-35-9]|7[3678])\\d{8}$'),
                },
              ],
            })(<Input placeholder="输入手机号" maxLength={11}/>)}
          </Form.Item>
          <Form.Item
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
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>用户开户注意事项</h4>
          <p>
            1.确保用户手机号输入准确无误。<br/>
            2.用户开户成功后，请用户妥善保管自己的用户账号。<br/>
            3.开户实行一户一表即每个水表对应一个用户账号，多个水表需要开多个账号。
          </p>

        </div>
      </Fragment>
    );
  }
}
