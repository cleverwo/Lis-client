import React, { Component } from 'react';
import {Button, Card, Table,} from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';

@connect(({ ctwingProduct }) => ({
  ctwingProduct,
}))
export default class LogList extends Component {
  componentWillMount() {
    this.refresh();
  }

  refresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ctwingProduct/fetch',
    });
  };

  // 产品刷新事件
  handleRefresh = e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ctwingProduct/refresh',
      callback: this.refresh,
    });
  };

  render() {
    const { loading, ctwingProduct: { data } } = this.props;

    const columns = [
      {
        title: '产品id',
        dataIndex: 'productId',
        key: 'productId',
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'master key',
        dataIndex: 'masterKey',
        key: 'masterKey',
      },
    ];

    return (
      <PageHeaderLayout title="电信平台产品列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="reload" type="primary" onClick={() => this.handleRefresh()}>
                刷新产品
              </Button>
            </div>
            <Table
              style={{ marginBottom: 24 }}
              pagination={false}
              loading={loading}
              dataSource={data}
              columns={columns}
              rowKey="productId"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
