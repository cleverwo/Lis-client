import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Divider, DatePicker, message } from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import moment from 'moment';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ waterRecord, user }) => ({
  waterRecord,
  authorities: user.authorities,
}))
@Form.create()
export default class Notice extends Component {
  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (!!fieldsValue.times && fieldsValue.times.length == 2) {
        let startDate = moment(fieldsValue.times[0]).format('YYYY-MM-DD HH:mm:ss');
        let endDate = moment(fieldsValue.times[1]).format('YYYY-MM-DD HH:mm:ss');
        fieldsValue.startDate = startDate;
        fieldsValue.endDate = endDate;
      }
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      console.log('提交后台数据为：', values);
      if (values.meterCode === undefined || values.meterCode === null) {
        message.error('水表账号不能为空');
      } else {
        dispatch({
          type: 'waterRecord/setFormValues',
          payload: values,
        });
        dispatch({
          type: 'waterRecord/fetch',
          payload: values,
        });
      }
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'waterRecord/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'waterRecord/initData',
    });
  };
  //选择水表事件
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'waterRecord/setSelectRows',
      payload: rows,
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, waterRecord: { formValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'waterRecord/fetch',
      payload: params,
    });
  };

  //回调 刷新列表
  callBackRefresh = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'waterRecord/setSelectRows',
      payload: [],
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'waterRecord/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'waterRecord/fetch',
        payload: values,
      });
    });
  };

  //返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入用户开户账号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="查询时间单位">
              {getFieldDecorator('searchUnit')(
                <Select defaultValues={'DAY'}>
                  <Option value="MONTH">月</Option>
                  <Option value="DAY">天</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="查询区间">
              {getFieldDecorator('times')(
                <RangePicker
                  ranges={{
                    今天: [moment().startOf('day'), moment().endOf('day')],
                    本周: [
                      moment()
                        .startOf('week')
                        .startOf('day'),
                      moment()
                        .endOf('week')
                        .endOf('day'),
                    ],
                    本月: [
                      moment()
                        .startOf('month')
                        .startOf('day'),
                      moment()
                        .endOf('month')
                        .endOf('day'),
                    ],
                  }}
                />
              )}
            </FormItem>
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
    const { loading, waterRecord: { selectedRows, data }, authorities } = this.props;

    const isOperate = authorities.indexOf('am_waterNotice_view') > -1;

    const columns = [
      {
        title: '记录ID',
        dataIndex: 'recordId',
        key: 'recordId',
      },
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用水量',
        dataIndex: 'waterVolume',
        key: 'waterVolume',
        render: val => (val ? `${val}吨` : '未获的数据'),
      },
      {
        title: '金额',
        dataIndex: 'consumePrice',
        key: 'consumePrice',
        render: val => (val ? `${val}元` : '未获的数据'),
      },
      {
        title: '余额',
        dataIndex: 'balance',
        key: 'balance',
        render: val => (val ? `${val}元` : '未获的数据'),
      },
      {
        title: '水价类型',
        dataIndex: 'waterType',
        key: 'waterType',
      },
      {
        title: '记录时间',
        dataIndex: 'recordDate',
        key: 'recordDate',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: () => {},
      },
    ];

    return (
      <PageHeaderLayout title="用户开户">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            rowKey={record => record.id}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
