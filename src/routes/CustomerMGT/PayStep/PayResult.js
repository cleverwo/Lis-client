import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

const transform = {
  ZHIFUBAO: '支付宝',
  WEIXIN: '微信',
  CASH: '现金',
  BANK_CARD: '银联',
};

@connect(({ customer }) => ({
  customer,
}))
export default class PayResult extends React.PureComponent {
  onFinish = () => {
    const { dispatch } = this.props;
    //清空用户信息
    dispatch({
      type: 'customer/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'customer/saveCustomer',
      payload: {},
    });
    dispatch(routerRedux.push('/customer/topUp'));
  };

  render() {
    const { customer: { record, reChargeId, userId } } = this.props;
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            账户号：
          </Col>
          <Col xs={24} sm={16}>
            {record.meterCode}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            充值方式：
          </Col>
          <Col xs={24} sm={16}>
            {transform[record.payType]}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            充值金额：
          </Col>
          <Col xs={24} sm={16}>
            {record.addPrice}元
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button
          href={`/admin/customer/exportPayReceipt?payRechargeId=${reChargeId}`}
          icon="download"
          style={{ marginRight: 20 }}
        >
          打印收据
        </Button>
        <Button type="primary" onClick={this.onFinish}>
          完成
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="最晚明日8点到账"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}
