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
import ApplicationForm from '@/routes/sampleMGT/Collect/applicatonForm';

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
export default class Collect extends Component {

  //显示搜索框
  renderForm() {
    return this.props.sample.expandSearchForm
      ? this.renderCollectFormDown()
      : this.renderCollectFormClose();
  }

  // 展开收缩框
  renderCollectFormDown() {
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
  renderCollectFormClose() {
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

  //改变新增样本信息modal状态
  changeAddModalVisible = data => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sample/setAddModalVisible',
      payload: data,
    });
  };

  //取消新增样本信息modal
  handleAddModalVisible = data =>{
    this.changeAddModalVisible(false);
  };

  //刷新样本列表
  callBackRefresh = () => {
    const {dispatch, form} = this.props;
    // dispatch({
    //   type: 'waterMeter/setSelectRows',
    //   payload: [],
    // });
    // form.validateFields((err, fieldsValue) => {
    //   if (err) return;
    //   const values = {
    //     ...fieldsValue,
    //     updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
    //   };
    //   dispatch({
    //     type: 'waterMeter/setFormValues',
    //     payload: values,
    //   });
    //   dispatch({
    //     type: 'waterMeter/fetch',
    //     payload: values,
    //   });
    // });
  };

  render() {
    const { sample: { selectedRows, addModalVisible } } = this.props;
    const data_demo = {
      list: [
        {
          groupNum: '5205',
          name: '安冬青',
          sex: '女',
          age: '38岁',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '1153',
          name: '刘少志',
          sex: '男',
          age: '43岁',
          barCode: '1153',
          createTime: '2019-09-07',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '1160',
          name: '耿银菲',
          sex: '女',
          age: '21岁',
          barCode: '1162',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '1180',
          name: '邱笑寒',
          sex: '女',
          age: '22岁',
          barCode: '1182',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '1201',
          name: '张宝亮',
          sex: '男',
          age: '29岁',
          barCode: '1201',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '5205',
          name: '晁馨颖',
          sex: '女',
          age: '2岁',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '5205',
          name: '纪孙雨',
          sex: '男',
          age: '4岁',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '5205',
          name: '范贺宁',
          sex: '男',
          age: '0天',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '5205',
          name: '李延华',
          sex: '女',
          age: '36岁',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },
        {
          groupNum: '5205',
          name: '霍铭轩',
          sex: '男',
          age: '9月',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        },{
          groupNum: '5205',
          name: '马明明',
          sex: '女',
          age: '33岁',
          barCode: '5205',
          createTime: '2019-09-22',
          sampleType: '血清',
          sampleStatus: '待核收',
          isEmerge: '否',
          patientType: '体检',
        }
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
        title: '同组序号',
        dataIndex: 'groupNum',
        key: 'groupNum',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
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
      },
      {
        title: '条码',
        dataIndex: 'barCode',
        key: 'barCode',
      },
      {
        title: '采集时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '标本',
        dataIndex: 'sampleType',
        key: 'sampleType',
      },
      {
        title: '标本状态',
        dataIndex: 'sampleStatus',
        key: 'sampleStatus',
      },
      {
        title: '是否急诊',
        dataIndex: 'isEmerge',
        key: 'isEmerge',
      },
      {
        title: '病人类型',
        dataIndex: 'patientType',
        key: 'patientType',
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
    const detailColumns=[
      {
        title: '条码同组标记',
        dataIndex: 'sampleGroupType',
        key: 'sampleGroupType',
        width: 50,
      },
      {
        title: '检验项目组合',
        dataIndex: 'applyItemGroup',
        key: 'applyItemGroup',
        width: 80,
      },
      {
        title: '标本类型',
        name: 'sampleType',
        key: 'sampleType',
        width: 50,
      }
    ];

    return (
      <PageHeaderLayout title="样本采集" noMargin>
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
        <Card bodyStyle={{paddingBottom:0,paddingTop: 0}}>
          <Table
            bordered
            data={detailData}
            columns={detailColumns}
            style={{width: '40%'}}
          />
        </Card>
        <FooterToolbar extra={1}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.changeAddModalVisible(true)}>
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
        </FooterToolbar>
        <ApplicationForm
          modalVisible={addModalVisible}
          handleModalVisible={this.handleAddModalVisible}
          callBackRefresh={this.callBackRefresh}
        />

      </PageHeaderLayout>
    );
  }
}
