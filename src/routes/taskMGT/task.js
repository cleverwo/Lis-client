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
  DatePicker, Table,Radio
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import FooterToolbar from '@/components/FooterToolbar';
import styles from '@/routes/sampleMGT/styles.less';


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
export default class Task extends Component {

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
            <FormItem label="仪器">
              {getFieldDecorator('sampleState')(
                <Select placeholder="请选择" style={{ width: '100%' }} defaultValue='血液分析仪(Sysmex_XN2800)'>
                  <Select.Option key="WEIXIN" value="WEIXIN">
                    血液分析仪(Sysmex_XN2800)
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
            <FormItem label="核收时间">
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
            <FormItem label="姓名">
              {getFieldDecorator('sampleState')(
                <Input/>
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
          <Col md={6} sm={24}>
            <FormItem label="仪器">
              {getFieldDecorator('sampleState')(
                <Select placeholder="请选择" style={{ width: '100%' }} defaultValue='血液分析仪(Sysmex_XN2800)'>
                  <Select.Option key="WEIXIN" value="WEIXIN">
                    血液分析仪(Sysmex_XN2800)
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
          <Col md={6} sm={24}>
            <FormItem label="核收时间">
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
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('sampleState')(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

  //单选框选择事件
  onChange = e => {
    console.log('radio checked', e.target.value);

  };

  render() {
    const { sample: { selectedRows, data } } = this.props;
    const data_demo = {
      list: [
        {name: '张付爱', 	sex: '女',   age: '58岁', sampleType: '分泌物',  barCode:'29969',    signTime: '',   signMan: '',    collectTime: '2019-12-20',  },
        {name: '张婷',  	sex: '女',     age: '30岁', sampleType: '分泌物',    barCode:'30303',    signTime: '',   signMan: '',    collectTime: '2019-12-21',  },
        {name: '刘慧', sex: '女',     age: '23岁', sampleType: '血清',    barCode:'29336',    signTime: '',   signMan: '',    collectTime: '2019-12-19',  },
        {name: '邱平杰',   sex: '女',   age: '52岁', sampleType: '分泌物',  barCode:'31132',    signTime: '',   signMan: '',    collectTime: '2019-12-24',  },
        {name: '王笋',   sex: '女',   age: '21岁', sampleType: '血清',    barCode:'31351',    signTime: '',   signMan: '',    collectTime: '2019-12-25',  },
        {name: '魏田田',   sex: '女',   age: '28岁', sampleType: '血清',   barCode:'31346',    signTime: '',   signMan: '',    collectTime: '2019-12-25',  },
        {name: '郭汶硕',   sex: '男',   age: '5月', sampleType: '血清',    barCode:'32039',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '郭汶硕',   sex: '男',   age: '5月', sampleType: '血清',    barCode:'32037',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '李振男',   sex: '女',   age: '27岁', sampleType: '血清',   barCode:'32032',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '白佳卉',   sex: '女',   age: '6岁', sampleType: '血清',    barCode:'32027',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '白佳卉',   sex: '女',   age: '6岁', sampleType: '血清',    barCode:'32026',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '白佳卉',   sex: '女',   age: '6岁', sampleType: '尿液',    barCode:'32025',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '李曦晴',   sex: '女',   age: '1月', sampleType: '血液(全血)',    barCode:'32011',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
        {name: '宋姝昕',   sex: '女',   age: '4月', sampleType: '尿液',    barCode:'29764',    signTime: '',   signMan: '',    collectTime: '2019-12-19',  },
        {name: '刘智语',   sex: '女',   age: '1岁', sampleType: '粪便',    barCode:'30070',    signTime: '',   signMan: '',    collectTime: '2019-12-20',  },
        {name: '刘智语',   sex: '女',   age: '1岁', sampleType: '尿液',    barCode:'30068',    signTime: '',   signMan: '',    collectTime: '2019-12-20',  },
        {name: '苗志元',   sex: '男',   age: '29岁', sampleType: '精液',   barCode:'29894',    signTime: '',   signMan: '',    collectTime: '2019-12-20',  },
        {name: '张海娇',   sex: '女',   age: '31岁', sampleType: '分泌物',  barCode:'31050',    signTime: '',   signMan: '',    collectTime: '2019-12-24',  },
        {name: '江岽汉',   sex: '男',   age: '1岁', sampleType: '尿液',    barCode:'30056',    signTime: '',   signMan: '',    collectTime: '2019-12-20',  },
        {name: '杨鸿暄',   sex: '男',   age: '3岁', sampleType: '血清',    barCode:'31994',    signTime: '',   signMan: '',    collectTime: '2019-12-27',  },
      ],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 6471,
      },
    };
    const columns = [
      {
        title: '实验号',
        dataIndex: 'instrumentIndex',
        key: 'instrumentIndex',
        width: 70
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'deviceId',
        width: 70,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 60,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 60,
      },
      {
        title: '病人类型',
        dataIndex: 'patientType',
        key: 'patientType',
        width: 100,
      },
      {
        title: '标本状态',
        dataIndex: 'sampleType',
        key: 'sampleType',
        width: 100,
      },
      {
        title: '标本类型',
        dataIndex: 'sampleStatus',
        key: 'sampleStatus',
        width: 100,
      },
      {
        title: '条码',
        dataIndex: 'barCode',
        key: 'barCode',
        width: 80,
      },
      {
        title: '签收时间',
        dataIndex: 'signTime',
        key: 'signTime',
        width: 100,
      },
      {
        title: '签收人',
        dataIndex: 'signMan',
        key: 'signMan',
        width: 80,
      },
      {
        title: '采集时间',
        dataIndex: 'collectTime',
        key: 'collectTime',
        width: 100,
      },
      {
        title: '采集人',
        dataIndex: 'collectOperator',
        key: 'collectOperator',
        width: 80,
      },

      {
        title: '处方科室',
        dataIndex: 'doctorDepartment',
        key: 'doctorDepartment',
        width: 100,
      },
      {
        title: '处方医生',
        dataIndex: 'doctor',
        key: 'doctor',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 110,
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.showViewModal(record)}>
              查看
            </a>
          </span>
        ),
      },
    ];
    const detail_demo = [
      {
        sampleGroupTip: '微生物',
        itemGroup: '阴道微生态检测',
        sampleType: '分泌物',
        charge: '120￥',
        chargeNum: 120,
      },
      {
        index: '总计',
        charge: '120￥'
      }
    ];
    const detail_columns = [
      {
        title: '行号',
        dataIndex: 'index',
        key: 'index',
        width: 70,
        render: (text, row, index) => {
          if (index+1 < detail_demo.length) {
            return <span>{index+1}</span>
          }
          return {
            children: <span style={{fontWeight: 600}}>总计</span>,
            props: {
              colSpan: 1,
            },
          };
        }
      },
      {
        title: '条码同组标记',
        dataIndex: 'sampleGroupTip',
        key: 'sampleGroupTip',
      },
      {
        title: '检验项目组合',
        dataIndex: 'itemGroup',
        key: 'itemGroup',
      },
      {
        title: '标本类型',
        dataIndex: 'sampleType',
        key: 'sampleType',
      },
      {
        title: '项目金额',
        dataIndex: 'charge',
        key: 'charge',
      },
    ];

    return (
      <PageHeaderLayout title="样本检测" noMargin>
        <Card bordered={false} style={{ paddingBottom: 0 }} size='small'>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Divider className={styles['override-ant-divider-horizontal']}/>
            <Radio.Group onChange={this.onChange} value={1}>
              <Radio value={1}>全部样本:6471</Radio>
              <Radio value={2}>待审核:68</Radio>
              <Radio value={3}>审核:128</Radio>
              <Radio value={4}>打印:6275</Radio>
            </Radio.Group>
            <Row gutter={16}>
              <Col span={15}>
                <StandardTable
                  selectedRows={selectedRows}
                  loading={false}
                  data={data_demo}
                  columns={columns}
                  rowKey={record => record.id}
                  onSelectRow={null}
                  onChange={null}
                  scroll={{ x: 1500,}}
                />
              </Col>
              <Col span={9}>
                <Table
                  className={styles['override-ant-table-body']}
                  pagination={{ hideOnSinglePage: true }}
                  bordered
                  dataSource={detail_demo}
                  columns={detail_columns}
                />
              </Col>
            </Row>
            <FooterToolbar extra={1}>
              <div className={styles.tableListOperator}>
                <Button type="primary" onClick={() => console.log(11)}>
                  样本签收
                </Button>
                <Button onClick={() => console.log(11)}>
                  样本拒签
                </Button>
                <Button onClick={() => console.log(11)}>
                  导出
                </Button>
                <Button onClick={() => console.log(11)}>
                  打印
                </Button>
                {selectedRows.length > 0 &&
                <Button icon="minus" onClick={console.log(1)}>
                  作废条码
                </Button>
                }
              </div>
            </FooterToolbar>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
