import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col, message, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../../../common/common.less';
import { filterNullFields } from '../../../utils/utils';
import DescriptionList from '../../../components/DescriptionList/index';

const { Description } = DescriptionList;

@connect(({ customer }) => ({
  customer,
}))
@Form.create()
export default class PayBefore extends React.PureComponent {
  //下一步
  onValidateForm = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/customer/topUp/payMoney'));
  };

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'customer/fetchCustomer',
        payload: values,
      });
      dispatch({
        type: 'customer/setFormValues',
        payload: values,
      });
    });
  };

  //重置查询选项为初始值
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'customer/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'customer/saveCustomer',
      payload: {},
    });
  };

  //搜索框
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <Form.Item label="水表编号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入账户" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { customer: { record } } = this.props;

    console.log("dfdfdf",record)
    return (
      <div>
        <Card bordered={false} className={styles.stepForm}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Divider style={{ marginBottom: 32 }} />
            <div>
              <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
                <Description term="水表编号">{record.meterCode}</Description>
                <Description term="用户姓名">{record.customerName}</Description>
                <Description term="手机号">{record.customerPhone}</Description>

                <Description term="用户余额">{record.waterBalance}元</Description>
                <Description term="用户待充值金额">{record.toBeCharge}元</Description>
                <Description term="用水性质">{record.waterPrice}</Description>
                <Description term="当前结算日累计流量">{record.waterFlow}m³</Description>
              </DescriptionList>
              <DescriptionList size="small" col={1} style={{ marginBottom: 32 }}>
                <Description term="水表地址">{record.address}</Description>
                <Description term="水表详细地址">{record.description}</Description>
                <Description term="开户营业厅">{record.hallName}</Description>
              </DescriptionList>
            </div>
            <Divider style={{ marginBottom: 32 }} />
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={this.onValidateForm}>
                下一步
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
