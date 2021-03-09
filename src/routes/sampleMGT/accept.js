import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Divider,
  Icon,
  Modal,
  Switch,
  Dropdown,
  DatePicker,
  Menu,
} from 'antd';
import styles from '@/common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({ sample }) => ({
  sample,
}))
@Form.create()
export default class Accept extends Component {

  //显示搜索框
  renderForm() {
    return this.props.sample.expandSearchForm
      ? this.renderFormDown()
      : this.renderFormClose();
  }

  // 展开收缩框
  renderFormDown() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="采集时间">
              {getFieldDecorator('createTime')(
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
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标本状态">
              {getFieldDecorator('sampleState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option key="WEIXIN" value="WEIXIN">
                    待核收
                  </Select.Option>
                  <Select.Option key="ZHIFUBAO" value="ZHIFUBAO">
                    待检验
                  </Select.Option>
                  <Select.Option key="CASH" value="CASH">
                    已检验
                  </Select.Option>
                  <Select.Option key="BANK_CARD" value="BANK_CARD">
                    拒签
                  </Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="病人名称">
              {getFieldDecorator('patientName')(<Input placeholder=""/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="标本条码">
              {getFieldDecorator('barCode')(<Input placeholder=""/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否急诊">
              {getFieldDecorator('isEmerged')(<Input placeholder=""/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
              <span style={{ float: 'left', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  刷新列表
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(false)}>
                  收起
                  <Icon type="up"/>
                </a>
              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 收缩收缩框
  renderFormClose() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="采集时间">
              {getFieldDecorator('createTime')(
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
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标本状态">
              {getFieldDecorator('sampleState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option key="WEIXIN" value="WEIXIN">
                    待核收
                  </Select.Option>
                  <Select.Option key="ZHIFUBAO" value="ZHIFUBAO">
                    待检验
                  </Select.Option>
                  <Select.Option key="CASH" value="CASH">
                    已检验
                  </Select.Option>
                  <Select.Option key="BANK_CARD" value="BANK_CARD">
                    拒签
                  </Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
              <span style={{ float: 'left', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  刷新列表
                </Button>
                <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(true)}>
                  展开
                  <Icon type="down"/>
                </a>
              </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //设置查询条件是否展开
  saveExpandSearchForm = data => {
    this.props.dispatch({
      type: 'sample/setExpandSearchForm',
      payload: data,
    });
  };

  render() {
    const { sample: { selectedRows, data } } = this.props;
    const data_demo = {
      list: [
        {
          name: 'sss',
        },
      ],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 20
      },
    };
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'deviceId',
        fixed: 'left'
      },
      {
        title: '条码',
        dataIndex: 'waterBalance',
        key: 'waterBalance',
        fixed: 'left'
      },
      {
        title: '采集时间',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '标本状态',
        dataIndex: 'updateTime',
        key: 'updateTime',
        fixed: 'left'
      },
      {
        title: '是否急诊',
        dataIndex: 'meterState',
        key: 'meterState',
      },
      {
        title: '病人类型',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '处方科室',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '处方医生',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '签收时间',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '签收人',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.showViewModal(record)}>
              查看
            </a>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout title="样品核收">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => console.log(11)}>
                检验申请
              </Button>
              <Button onClick={() => console.log(11)}>
                更新采集时间
              </Button>
              <Button onClick={() => console.log(11)}>
                打印条码
              </Button>
              <Button onClick={() => console.log(11)}>
                条码预览
              </Button>
              {selectedRows.length > 0 &&
              <Button icon="minus" onClick={console.log(1)}>
                作废条码
              </Button>
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={false}
              data={data_demo}
              columns={columns}
              rowKey={record => record.id}
              onSelectRow={null}
              onChange={null}
              scroll={{ x: 1500 }}
              sticky
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
