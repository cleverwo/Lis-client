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
  Table,
} from 'antd';
import styles from '@/common/common.less';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import FooterToolbar from '@/components/FooterToolbar';
import style from '@/routes/styles.less';

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
export default class Receive extends Component {

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
            <FormItem label="留存时间">
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

  //复选样本事件
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'sample/setSelectRows',
      payload: rows,
    });
  };

  render() {
    const { sample: { selectedRows, data } } = this.props;
    const data_demo = {
      list: [
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
        {
          name: 'sss',
        },
      ],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 20,
      },
    };
    const detailData = [
      {
        sampleGroupType: 111,
        applyItemGroup: 222,
        sampleType: '血清'
      },
      {
        sampleGroupType: 111,
        applyItemGroup: 222,
        sampleType: '血清'
      },
      {
        sampleGroupType: 111,
        applyItemGroup: 222,
        sampleType: '血清'
      }
    ]
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'deviceId',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
      },
      {
        title: '标本类型',
        dataIndex: 'sampleType',
        key: 'updateTime',
        fixed: 'left',
      },
      {
        title: '条码',
        dataIndex: 'barCode',
        key: 'barCode',
      },
      {
        title: '签收时间',
        dataIndex: 'updateTime',
        key: 'customerName',
      },
      {
        title: '签收人',
        dataIndex: 'signMan',
        key: 'signMan',
      },
      {
        title: '采集时间',
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
      <PageHeaderLayout title="样本核收" noMargin>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={false}
              data={data_demo}
              columns={columns}
              rowKey={record => record.id}
              onSelectRow={this.handleSelectRows}
              onChange={null}
              sticky
            />
          </div>
        </Card>
        <FooterToolbar extra={1}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => console.log(11)}>
              登记
            </Button>
            <Button onClick={() => console.log(11)}>
              修改
            </Button>
            <Button onClick={() => console.log(11)}>
              导出
            </Button>
            {selectedRows.length > 0 &&
            <Button icon="minus" onClick={console.log(1)}>
              作废
            </Button>
            }
          </div>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
