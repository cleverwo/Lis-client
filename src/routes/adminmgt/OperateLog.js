import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import styles from './styles.less';
import Ellipsis from '../../components/Ellipsis';
import { Card, Form, Button, Table, Row, Col, Input, DatePicker, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { filterNullFields } from '../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ operateLog, enumeration, loading }) => ({
  operateLog,
  enumeration,
  loading: loading.models.operateLog,
}))
@Form.create()
export default class OperateLog extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operateLog/fetch',
    });
    dispatch({
      type: 'enumeration/fetch',
      payload: {
        enumType: 'SYSTEM_LOG_TYPE',
      },
      callback: data => {
        dispatch({
          type: 'operateLog/setLogType',
          payload: data,
        });
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (!!fieldsValue.times && fieldsValue.times.length == 2) {
        let realTimes = new Array(2);
        realTimes[0] = moment(fieldsValue.times[0]).format('YYYY-MM-DD HH:mm');
        realTimes[1] = moment(fieldsValue.times[1]).format('YYYY-MM-DD HH:mm');
        fieldsValue.times = realTimes;
      }
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      console.log('提交后台数据为：', values);
      dispatch({
        type: 'operateLog/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'operateLog/fetch',
        payload: values,
      });
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, operateLog: { formValues } } = this.props;

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
      type: 'operateLog/fetch',
      payload: params,
    });
  };

  onDateChange = (dates, dateStrings) => {
    //console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  };

  //搜索框 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'operateLog/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'operateLog/fetch',
      payload: {},
    });
  };

  //搜索框
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { operateLog: { logType } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={8} sm={20}>
            <FormItem label="操作时间">
              {getFieldDecorator('times')(
                <RangePicker
                  onChange={this.onDateChange}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始时间', '结束时间']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={20}>
            <FormItem label="操作人员">{getFieldDecorator('person')(<Input />)}</FormItem>
          </Col>
          <Col md={5} sm={20}>
            <FormItem label="日志类型">
              {getFieldDecorator('logType')(
                <Select placeholder="请选择" style={{ width: 120 }}>
                  {logType.map(type => (
                    <Option key={type.code} value={type.description}>
                      {type.description}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={20}>
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
    const { operateLog: { data: { list, pagination } }, loading } = this.props;

    let newPagination = { ...pagination };
    if (pagination.current == undefined) {
      newPagination = { ...pagination, current: pagination.pageNum };
    }

    function showTotal(total, range) {
      return () => {
        return <span className={styles.showTotal}>共 {total} 条</span>;
      };
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: showTotal(newPagination.total),
      ...newPagination,
    };

    const columns = [
      {
        title: '日志ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        align: 'center',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '操作人员',
        dataIndex: 'user.userName',
        key: 'user.userName',
      },
      {
        title: '日志类型',
        dataIndex: 'enumeration.description',
        key: 'enumeration.description',
      },
      {
        title: '请求IP',
        dataIndex: 'ip',
        key: 'ip',
        align: 'center',
      },
      {
        title: '请求URL',
        dataIndex: 'url',
        key: 'url',
        align: 'center',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '请求METHOD',
        dataIndex: 'method',
        key: 'method',
        align: 'center',
      },
      {
        title: '入参',
        dataIndex: 'input',
        key: 'input',
        align: 'center',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '返回码',
        dataIndex: 'msgCode',
        key: 'msgCode',
        align: 'center',
      },
      {
        title: '返回信息',
        dataIndex: 'msg',
        key: 'msg',
        align: 'center',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '出参',
        dataIndex: 'data',
        key: 'data',
        align: 'center',
        render: text => (
          <Ellipsis length={10} tooltip>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '请求时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        align: 'center',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '请求耗时',
        dataIndex: 'interval',
        key: 'interval',
        align: 'center',
      },
    ];

    return (
      <PageHeaderLayout title="操作记录">
        <Card bordered={false}>
          <div>
            <div>{this.renderForm()}</div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={list}
              pagination={paginationProps}
              loading={loading}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
