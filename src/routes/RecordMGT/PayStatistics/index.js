import React, {Component} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Card, DatePicker, Button, Form, Row, Col, Input, Select, Tabs} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from "../../../components/StandardTable/index";
import OffLineStatistics from "./OffLineStatistics";
import OnLineStatistics from "./OnLineStatistics";
import {filterNullFields} from '../../../utils/utils';
import styles from './style.less';

const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const PAYTYPE = {
  WEIXIN: '微信',
  CASH: '现金',
  ZHIFUBAO: '支付宝',
  BANK_CARD: '银行卡'
};
const PAYSTATUS = {
  PAYING: '充值中',
  PAY_SUCCESS: '成功',
  PAY_FAILED: '失败',
};

@connect(({payStatistics, user,waterPrice,person}) => ({
  payStatistics,
  person,
  waterPrice,
  authorities: user.authorities,
}))
class PayStatistics extends Component {

  componentDidMount() {
    const {dispatch} = this.props;
    //查单数统计
    dispatch({
      type: 'payStatistics/fetch',
      payload: {},
    });
    //初始化价格下拉框
    dispatch({
      type: 'waterPrice/fetchList',
    });
    //初始化人员下拉框
    dispatch({
      type: 'person/getSubordinateList',
    });
    //查询单数总额
    dispatch({
      type: 'payStatistics/fetchMoney',
      payload: {},
    })
  }

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch, payStatistics: {formValues}} = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
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
      type: 'payStatistics/fetch',
      payload: params,
    });
    dispatch({
      type: 'payStatistics/fetchMoney',
      payload: params,
    });
  };

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.timeRange !== undefined) {
        let startTime = fieldsValue.timeRange[0];
        let endTime = fieldsValue.timeRange[1];
        startTime = moment(startTime).format('YYYY-MM-DD');
        endTime = moment(endTime).format('YYYY-MM-DD');
        fieldsValue.timeRange = [startTime, endTime];
      }
      filterNullFields(fieldsValue);
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'payStatistics/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'payStatistics/fetch',
        payload: values,
      });
      dispatch({
        type: 'payStatistics/fetchMoney',
        payload: values,
      });
    });
  };

  //重置搜索框内容
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'payStatistics/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'payStatistics/fetch',
      payload: {},
    });
    dispatch({
      type: 'payStatistics/fetchMoney',
      payload: {},
    });
  };

  //返回搜索框信息
  renderForm() {
    return this.renderSimpleForm();
  }

  //未展开搜索框
  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    const {waterPrice: { waterPriceList }, person: { subordinate }} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入水表账号" maxLength={12}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="操作人员">
              {getFieldDecorator('operatorId')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  {subordinate.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.userName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用水性质">
              {getFieldDecorator('priceId')(
                <Select placeholder="请选择" style={{width: '100%'}}>
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
            <FormItem label="支付方式">
              {getFieldDecorator('payType')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option key="WEIXIN" value="WEIXIN">
                    微信
                  </Option>
                  <Option key="ZHIFUBAO" value="ZHIFUBAO">
                    支付宝
                  </Option>
                  <Option key="CASH" value="CASH">
                    现金
                  </Option>
                  <Option key="BANK_CARD" value="BANK_CARD">
                    银行卡
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
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
          <Col md={6} sm={24}>
            <FormItem label="线上线下">
              {getFieldDecorator('payWay')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="OffLine">线下</Option>
                  <Option value="OnLine">线上</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="时间范围">
              {getFieldDecorator('timeRange')(
                <RangePicker
                  format="YYYY-MM-DD"
                  style={{width: '100%'}}
                  placeholder={[
                    "开始时间",
                    "结束时间",
                  ]}
                  showTime
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div style={{overflow: 'hidden'}}>
              <div style={{float: 'right', marginBottom: 24}}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {loading, payStatistics: {data,statisticsMoneyData},person: { subordinate }} = this.props;
    console.log("-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data)
    const orderColumns = [
      {
        title: '日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm:ss')}</span>,
      },
      {
        title: '充值水表',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用水性质',
        dataIndex: 'priceName',
        key: 'priceName',
      },
      {
        title: '收费金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        render: val => <span>{val}元</span>
      },
      {
        title: '操作人员',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        key: 'payType',
        render: val => PAYTYPE[val]
      },
      {
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        render: val => PAYSTATUS[val]
      },
      {
        title: '线上线下',
        dataIndex: 'payWay',
        key: 'payWay',
        render: val => <span>{val === "OnLine" ? "线上" : "线下"}</span>
      },
    ];

    return (
      <PageHeaderLayout title="收费统计">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
        </Card>
        <br/>
        <Card bordered={true} title="单数统计">
          <div className={styles.title}>
            <span>金额：{statisticsMoneyData} 元</span>
          </div>
          <StandardTable
            selectedRows={[]}
            rowKey={record => record.id}
            loading={loading}
            columns={orderColumns}
            data={data}
            onChange={this.handleStandardTableChange}
            scroll={{x: 1200}}
            noSelect={true}
          />
        </Card>

        <Card bordered={true} title="报表导出">
          <Tabs defaultActiveKey="1">
            <TabPane tab="线下" key="1">
              <OffLineStatistics loading={loading} subordinate={subordinate}/>
            </TabPane>
            <TabPane tab="线上" key="2">
              <OnLineStatistics loading={loading} subordinate={subordinate}/>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(PayStatistics);
