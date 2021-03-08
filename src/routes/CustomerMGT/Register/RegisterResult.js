import React, { PureComponent,Fragment } from 'react';
import { connect } from 'dva';
import {Button, Col, Row} from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';

@connect(({ customer, meter }) => ({
  customer,
  meter,
}))
export default class RegisterResult extends PureComponent {
  onFinish = () => {
    const { dispatch } = this.props;
    //清空用户信息
    dispatch({
      type: 'customer/initCustomerInfo',
    });
    //清空选中水表信息
    dispatch({
      type: 'meter/setSelectRows',
      payload: [],
    });
    dispatch({
      type: 'meter/setRecord',
      payload: {},
    });
    dispatch(routerRedux.push('/customer/register'));
  };

  render() {
    const { customer: { result,customerInfo} } = this.props;

    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户名称：
          </Col>
          <Col xs={24} sm={16}>
            {customerInfo.name}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            用户账户：
          </Col>
          <Col xs={24} sm={16}>
            {result}
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={this.onFinish}>
          完成
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="操作成功"
        description="妥善保管用户账号"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}
