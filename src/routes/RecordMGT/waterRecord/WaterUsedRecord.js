import React, {Component} from 'react';
import {Button, Card, Col, Form, Input, Row, Divider, DatePicker,} from 'antd';
import styles from '../../../common/common.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {connect} from 'dva';
import moment from 'moment';
import {filterNullFields} from '../../../utils/utils';
import StandardTable from '../../../components/StandardTable/index';
import FiveAddressCascader from "../../Components/FiveAddressCascader";
import RecordDetailModal from "./RecordDetailModal";

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
@connect(({waterRecord, user}) => ({
  waterRecord,
  currentUser: user.currentUser,
}))
@Form.create()
export default class WaterUsedRecord extends Component {
  state = {
    mode: ['month', 'month'],
    monthValue: [],
  };

  handlePanelChange = (monthValue, mode) => {
    this.setState({
      monthValue,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    });
    this.props.form.setFieldsValue({
      times: monthValue
    })
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterRecord/fetch',
    });
  }

  handleChange = (monthValue) => {
    this.setState({ monthValue });
  };

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (fieldsValue.times && fieldsValue.times.length === 2) {
        let startDate = moment(fieldsValue.times[0]).format('YYYY-MM');
        let endDate = moment(fieldsValue.times[1]).format('YYYY-MM');
        fieldsValue.startDate = startDate;
        fieldsValue.endDate = endDate;
      }
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        provinceCode: (fieldsValue.address && fieldsValue.address.length > 0) ? fieldsValue.address[0] : undefined,
        cityCode: (fieldsValue.address && fieldsValue.address.length > 1) ? fieldsValue.address[1] : undefined,
        areaCode: (fieldsValue.address && fieldsValue.address.length > 2) ? fieldsValue.address[2] : undefined,
        communityCode: (fieldsValue.address && fieldsValue.address.length > 3) ? fieldsValue.address[3] : undefined,
        blockCode: (fieldsValue.address && fieldsValue.address.length > 4) ? fieldsValue.address[4] : undefined,
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

  //搜索框重置事件
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'waterRecord/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'waterRecord/fetch',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch, waterRecord: {formValues}} = this.props;

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
      type: 'waterRecord/fetch',
      payload: params,
    });
  };

  //回调 刷新列表
  callBackRefresh = () => {
    const {dispatch, form} = this.props;
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

  handleDownload = () => {
    const { form, currentUser } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      if (fieldsValue.times && fieldsValue.times.length === 2) {
        let startDate = moment(fieldsValue.times[0]).format('YYYY-MM');
        let endDate = moment(fieldsValue.times[1]).format('YYYY-MM');
        fieldsValue.startDate = startDate;
        fieldsValue.endDate = endDate;
      }
      let url = '/admin/waterRecord/download?userId=' + currentUser.id;
      if (fieldsValue.address && fieldsValue.address.length > 0) url += '&provinceCode=' + fieldsValue.address[0];
      if (fieldsValue.address && fieldsValue.address.length > 1) url += '&cityCode=' + fieldsValue.address[1];
      if (fieldsValue.address && fieldsValue.address.length > 2) url += '&areaCode=' + fieldsValue.address[2];
      if (fieldsValue.address && fieldsValue.address.length > 3) url += '&communityCode=' + fieldsValue.address[3];
      if (fieldsValue.address && fieldsValue.address.length > 4) url += '&blockCode=' + fieldsValue.address[4];
      if (fieldsValue.startDate) url += '&startDate=' + fieldsValue.startDate;
      if (fieldsValue.endDate) url += '&endDate=' + fieldsValue.endDate;
      if (fieldsValue.meterCode) url += '&meterCode=' + fieldsValue.meterCode;
      if (fieldsValue.phone) url += '&phone=' + fieldsValue.phone;

      fetch(url).then(res => res.blob()).then(blob => {
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = '用水清单.xls';
        a.click();
        window.URL.revokeObjectURL(url);
      })
    });
  };

  // 点击记录详情
  handleClickDetail = meterId => {
    const { dispatch, waterRecord: {formValues} } = this.props;
    dispatch({
      type: 'waterRecord/setMeterId',
      payload: meterId,
    });
    const payload = {
      meterId: meterId,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
    };
    dispatch({
      type: 'waterRecord/fetchDetail',
      payload: payload,
    });
    this.handleDetailModalVisible(true);
  };

  // 记录详情modal
  handleDetailModalVisible = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterRecord/setDetailModalVisible',
      payload: visible,
    });
  };

  //返回搜索框信息
  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const { mode } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入用户开户账号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入用户手机号"/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          {/*<Col md={6} sm={24}>
          <FormItem label="查询时间单位">
          {getFieldDecorator('searchUnit', {
          initialValue: 'DAY',
          })(
          <Select>
          <Option value="MONTH">月</Option>
          <Option value="DAY">天</Option>
          </Select>
          )}
          </FormItem>
          </Col>*/}
          <Col md={10} sm={32}>
            <Form.Item label="地址">
              {getFieldDecorator('address')(
                <FiveAddressCascader/>
              )}
            </Form.Item>
          </Col>
          <Col md={11} sm={24}>
            <FormItem label="查询区间">
              {getFieldDecorator('times')(
                <RangePicker
                  placeholder={['起始月份', '截止月份']}
                  format="YYYY-MM"
                  mode={mode}
                  onChange={this.handleChange}
                  onPanelChange={this.handlePanelChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <span style={{float: 'left', marginBottom: 24}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleDownload}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
        <p>注意：查询区间的起始月份不包含在查询范围内</p>
      </Form>
    );
  }

  render() {
    const {loading, waterRecord: { data, detailModalVisible }} = this.props;

    const columns = [
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用户姓名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '用户电话',
        dataIndex: 'customerPhone',
        key: 'customerPhone',
      },
      {
        title: '用户地址',
        dataIndex: 'address',
        key: 'address',
        width: 300,
      },
      {
        title: '总用水量',
        dataIndex: 'volumeSum',
        key: 'volumeSum',
        render: val => (val === undefined ? '未获得数据' :`${val}吨` ),
      },
      {
        title: '总用水金额',
        dataIndex: 'priceSum',
        key: 'priceSum',
        render: val => (val === undefined ?  '未获得数据' : `${val}元` ),
      },
      {
        title: '目前余额',
        dataIndex: 'balance',
        key: 'balance',
        render: val => (val === undefined ?  '未获得数据' : `${val}元` ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <a type="dashed" onClick={() => this.handleClickDetail(record.meterId)}>
            查看
          </a>
        )
      }
    ];

    return (
      <PageHeaderLayout title="用水记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
          <Divider style={{marginBottom: 32}}/>
          <StandardTable
            selectedRows={[]}
            loading={loading}
            data={data}
            columns={columns}
            rowKey={record => record.meterId}
            onChange={this.handleStandardTableChange}
            noSelect={ true }
          />
        </Card>
        <RecordDetailModal
          modalVisible={detailModalVisible}
          handleModalVisible={this.handleDetailModalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
