import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col, Divider, Table, message } from 'antd';
import styles from '../../../common/common.less';
import DescriptionList from '../../../components/DescriptionList';
import { filterNullFields } from '../../../utils/utils';
import moment from 'moment';

const { Description } = DescriptionList;

@connect(({ waterMeterChange }) => ({
  waterMeterChange,
}))
@Form.create()
export default class ChangeRecord extends Component {
  // 搜索框搜索事件
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
      if (
        (values.meterCode === undefined || values.meterCode === null) &&
        (values.phone === undefined || values.phone === null)
      ) {
        message.error('查询信息不能为空');
      } else {
        dispatch({
          type: 'waterMeterChange/saveSearchFormValues',
          payload: values,
        });
        dispatch({
          type: 'waterMeterChange/fetch',
          payload: values,
        });
      }
    });
  };

  // 重置搜索框
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'waterMeterChange/saveSearchFormValues',
      payload: {},
    });
    dispatch({
      type: 'waterMeterChange/saveRecord',
      payload: { changeRecord: { list: [], pagination: {} } },
    });
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <Form.Item label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入账户" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入用户手机号" />)}
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
    const { loading, waterMeterChange: { record } } = this.props;
    const changeList = record.changeRecord; // 更换记录列表

    const columns = [
      {
        title: '更换前水表编号',
        dataIndex: 'beforeMeterCode',
        key: 'beforeMeterCode',
      },
      {
        title: '更换后水表编号',
        dataIndex: 'afterMeterCode',
        key: 'afterMeterCode',
      },
      {
        title: '更换时间',
        dataIndex: 'changeTime',
        key: 'changeTime',
        render: val => moment(val).format('YYYY-MM-DD'),
      },
    ];

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Divider style={{ marginBottom: 32 }} />
            <div>
              <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }}>
                <Description term="用户账号">{record.meterCode}</Description>
                <Description term="用户姓名">{record.customerName}</Description>
                <Description term="手机号">{record.phone}</Description>
              </DescriptionList>
              <DescriptionList size="small" col={1} style={{ marginBottom: 32 }}>
                <Description term="水表地址">{record.location}</Description>
                <Description term="水表详细地址">{record.address}</Description>
              </DescriptionList>
            </div>

            <Table
              style={{ marginBottom: 24 }}
              loading={loading}
              dataSource={changeList.list}
              pagination={changeList.pagination}
              columns={columns}
              rowKey="id"
            />
          </div>
        </Card>
      </div>
    );
  }
}
