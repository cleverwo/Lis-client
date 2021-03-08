import React, { Component, Fragment } from 'react';
import {Button, Card, Col, Form, Input, Row, Select, Divider, DatePicker, Icon, message} from 'antd';
import styles from '../../../common/common.less';
import { connect } from 'dva';
import moment from 'moment';
import { filterNullFields } from '../../../utils/utils';
import StandardTable from '../../../components/StandardTable';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ payRecord, waterPrice }) => ({
  payRecord, waterPrice
}))
@Form.create()
export default class PayRecordOnline extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetchList',
    });
    dispatch({
      type: 'payRecord/fetchOnline'
    });
  }

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (fieldsValue.times && fieldsValue.times.length === 2) {
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
        type: 'payRecord/setFormValuesOnline',
        payload: values,
      });
      dispatch({
        type: 'payRecord/fetchOnline',
        payload: values,
      });
    });
  };

  //搜索框 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'payRecord/setFormValuesOnline',
      payload: {},
    });
    dispatch({
      type: 'payRecord/fetchOnline',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, payRecord: { formValuesOnline } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValuesOnline,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'payRecord/fetchOnline',
      payload: params,
    });
  };

  onDateChange = (dates, dateStrings) => {
    //console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { waterPrice: { waterPriceList } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入开户账号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入用户手机号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label={'用水性质'}>
              {getFieldDecorator('priceName')(
                <Select style={{ width: '100%' }}>
                  {waterPriceList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.typeName}
                    </Option>
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
            </span>
          </Col>
        </Row>
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="缴费时间">
              {getFieldDecorator('times')(
                <RangePicker
                  style={{width: '100%'}}
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
            <FormItem label="支付状态">
              {getFieldDecorator('payStatus')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="ALL">全部</Option>
                  <Option value="PAY_SUCCESS">成功</Option>
                  <Option value="PAY_FAILED">失败</Option>
                  <Option value="PAYING">充值中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, payRecord: { dataOnline } } = this.props;

    const columns = [
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用水性质',
        dataIndex: 'priceName',
        key: 'priceName',
      },
      {
        title: '实缴水费',
        dataIndex: 'payAmount',
        key: 'payAmount',
        render: (text, record) => {
          return text + '元';
        },
      },
      {
        title: '缴费前余额',
        dataIndex: 'payBeforeBalance',
        key: 'payBeforeBalance',
        render: (text, record) => {
          return text + '元';
        },
      },
      {
        title: '缴费前待充值金额',
        dataIndex: 'payBeforePrepaid',
        key: 'payBeforePrepaid',
        render: (text, record) => {
          return text + '元';
        },
      },
      {
        title: '充值状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
      },
      {
        title: '充值时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <StandardTable
            selectedRows={[]}
            loading={loading}
            data={dataOnline}
            columns={columns}
            rowKey={record => record.id}
            onChange={this.handleStandardTableChange}
            noSelect={true}
          />
        </Card>
      </Fragment>
    );
  }
}
