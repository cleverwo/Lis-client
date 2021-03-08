import React, { Component } from 'react';
import {Button, Card, Col, Form, Input, Row, Divider, DatePicker, Select, Icon,
} from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import { connect } from 'dva';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ operationLog }) => ({
  operationLog,
}))
@Form.create()
export default class LogList extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'operationLog/getCompanyList',
    });
    dispatch({
      type: 'operationLog/fetch',
    });
  }

  // 搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (!!fieldsValue.times && fieldsValue.times.length === 2) {
        let startDate = moment(fieldsValue.times[0]).format('YYYY-MM-DD');
        let endDate = moment(fieldsValue.times[1]).format('YYYY-MM-DD');
        fieldsValue.startDate = startDate;
        fieldsValue.endDate = endDate;
      }
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'operationLog/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'operationLog/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'operationLog/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'operationLog/fetch',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, operationLog: { formValues } } = this.props;

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
      type: 'operationLog/fetch',
      payload: params,
    });
  };

  //设置查询条件是否展开
  saveExpandSearchForm = data => {
    this.props.dispatch({
      type: 'operationLog/setExpandSearchForm',
      payload: data,
    });
  };

  //返回搜索框信息
  renderForm() {
    const { operationLog: { expandSearchForm } } = this.props;
    return expandSearchForm ? this.renderAdvanceForm() : this.renderSimpleForm();
  }

  // 简单搜索框信息
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
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
          <Col md={6} sm={48}>
            <FormItem label="登录账号">
              {getFieldDecorator('loginName')(<Input placeholder="输入登录账号" />)}
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
              <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(true)}>
                展开
                <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 展开搜索框信息
  renderAdvanceForm() {
    const { getFieldDecorator } = this.props.form;
    const { operationLog: { companyList } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
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
          <Col md={6} sm={48}>
            <FormItem label="登录账号">
              {getFieldDecorator('loginName')(<Input placeholder="输入登录账号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="操作类型">
              {getFieldDecorator('operationType')(
                <Select>
                  <Option key="INTERFACE" value="INTERFACE">
                    接口操作
                  </Option>
                  <Option key="OPERATION" value="OPERATION">
                    页面操作
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('coId')(
                <Select placeholder="所属公司">
                  {companyList.map(item => (
                    <Select.Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Select.Option>
                  ))}
                </Select>
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
              <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(false)}>
                收起
                <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, operationLog: { data } } = this.props;

    const columns = [
      {
        title: '登录账号',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '用户姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '所属公司',
        dataIndex: 'coName',
        key: 'coName',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '操作类型',
        dataIndex: 'operationType',
        key: 'operationType',
      },
      {
        title: '操作',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
      },
      {
        title: '请求URL',
        dataIndex: 'url',
        key: 'url',
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        key: 'method',
      },
      {
        title: '入参',
        dataIndex: 'input',
        key: 'input',
        width: 500,
      },
      {
        title: '出参',
        dataIndex: 'data',
        key: 'data',
        width: 400,
      },
      {
        title: '返回码',
        dataIndex: 'msgCode',
        key: 'msgCode',
      },
      {
        title: '返回信息',
        dataIndex: 'msg',
        key: 'msg',
      },
      {
        title: '请求时间',
        dataIndex: 'time',
        key: 'time',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '请求耗时',
        dataIndex: 'interval',
        key: 'interval',
        render: (text) => {
          return text + 'ms';
        },
      },
    ];

    return (
      <PageHeaderLayout title="操作日志">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Divider style={{ marginBottom: 32 }} />
            <StandardTable
              selectedRows={[]}
              loading={loading}
              data={data}
              columns={columns}
              rowKey={record => record.id}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 2500 }}
              noSelect={ true }
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
