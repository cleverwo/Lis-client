import React, { Component } from 'react';
import {Button, Card, Col, Form, Input, Row, Divider, DatePicker, Select} from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import moment from 'moment';
import { connect } from 'dva';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

@connect(({ mqttLog }) => ({
  mqttLog,
}))
@Form.create()
export default class LogList extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mqttLog/fetch',
    });
    dispatch({
      type: 'mqttLog/getMqttType',
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
        let createTime = moment(fieldsValue.times[0]).format('YYYY-MM-DD HH:mm');
        let endTime = moment(fieldsValue.times[1]).format('YYYY-MM-DD HH:mm');
        fieldsValue.endTime = endTime;
        fieldsValue.createTime = createTime;
      }
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'mqttLog/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'mqttLog/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'mqttLog/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'mqttLog/fetch',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, mqttLog: { formValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
     // 把查询框的查询条件展开
      ...formValues,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'mqttLog/fetch',
      payload: params,
    });
  };

  // 搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { mqttLog: { mqttType } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={48}>
            <FormItem label="主题:">
              {getFieldDecorator('topic')(<Input placeholder="输入主题" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="查询区间">
              {getFieldDecorator('times')(
                <RangePicker
                  format="YYYY-MM-DD HH:mm"
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
                  showTime={{ format: 'HH:mm' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('typeCode')(
                <Select placeholder="选择类型">
                  {mqttType.map(item => (
                    <Select.Option key={item.typeNum} value={item.typeNum}>
                      {item.typeName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading, mqttLog: { data } } = this.props;

    const columns = [
      {
        title: '主题',
        dataIndex: 'topic',
        key: 'topic',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
      },
      {
        title: '信息',
        dataIndex: 'messages',
        key: 'messages',
        width: 500
      },
    ];

    return (
      <PageHeaderLayout title="MQTT日志">
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
              scroll={{ x: 1300 }}
              noSelect={ true }
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
