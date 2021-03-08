import React, { Component, Fragment } from 'react';
import { Button, Card, Col, Form, Input, Row, Divider, DatePicker, Select } from 'antd';
import styles from '../../common/common.less';
import { connect } from 'dva';
import moment from 'moment';
import AlarmDetailModal from './AlarmDetailModal';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ alarm, user }) => ({
  alarm,
  authorities: user.authorities,
  currentUser: user.currentUser,
}))
@Form.create()
export default class DataAlarm extends Component {
  // 查看报警详情modal显示
  handleAlarmDetailVisible = (record, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/setAlarmDetailVisible',
      payload: visible,
    });
    dispatch({
      type: 'alarm/setRecord',
      payload: record,
    });
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/fetchDataAlarmList',
    });
  }

  // 搜索事件
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
        type: 'alarm/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'alarm/fetchDataAlarmList',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'alarm/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'alarm/fetchDataAlarmList',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, alarm: { formValues } } = this.props;

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
      type: 'alarm/fetchDataAlarmList',
      payload: params,
    });
  };

  // 回调 刷新列表
  callBackRefresh = () => {
    const { dispatch, form, alarm: { alarmData: { pagination } } } = this.props;
    console.log(pagination);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      };
      dispatch({
        type: 'alarm/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'alarm/fetchDataAlarmList',
        payload: values,
      });
    });
  };

  // 处理报警信息
  handleProcessAlarm = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/processDataAlarm',
      payload: data,
      callback: this.callBackRefresh,
    });
  };

  //到出EXCEL参数准备
  urlEncode = (param, key, encode) => {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof param;
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + (encode == null || encode ? encodeURIComponent(param) : param);
    } else {
      for (var i in param) {
        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += this.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { alarm: { formValues },currentUser} = this.props;
    let exportParam =  {
      startTime: formValues.times?moment(formValues.times[0]).format('YYYY-MM-DD'):undefined,
      endTime: formValues.times?moment(formValues.times[1]).format('YYYY-MM-DD'):undefined,
      alarmInformation: formValues.alarmInformation,
      alarmGroup: "1",
      userCoId: currentUser.id,
    };
    exportParam = this.urlEncode(exportParam);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="水表编号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入水表编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="报警类型">
              {getFieldDecorator('alarmInformation')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option key="PURCHASE_AMOUNT" value="购水金额超限值">
                    购水金额超限值
                  </Option>
                  <Option key="BUY_PRICE_CODE_WRONG" value="购水序号有误">
                    购水序号有误
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button style={{ marginLeft: 8 }} href={`/admin/alarm/export?${exportParam}`}>
                导出
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      alarm: { alarmData, alarmDetailVisible },
      authorities,
    } = this.props;

    const isOperate = authorities.indexOf('am_Alarm_edit') > -1;

    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'alarmId',
      //   key: 'alarmId',
      // },
      {
        title: '水表编号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '报警信息',
        dataIndex: 'alarmInfo',
        key: 'alarmInfo',
      },
      {
        title: '用户姓名',
        dataIndex: 'cusName',
        key: 'cusName',
      },
      {
        title: '用户地址',
        dataIndex: 'cusAddress',
        key: 'cusAddress',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '所属大厅',
        dataIndex: 'hallName',
        key: 'hallName',
      },
      {
        title: '报警日期',
        dataIndex: 'alarmDate',
        key: 'alarmDate',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '处理状态',
        dataIndex: 'alarmState',
        key: 'alarmState',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.handleAlarmDetailVisible(record, true)}>
              查看
            </a>
            <Divider type="vertical" dashed={record.alarmState === '已处理' || !isOperate} />
            {isOperate ? (
              <a
                type="dashed"
                onClick={() => this.handleProcessAlarm(record.alarmId)}
                hidden={record.alarmState === '已处理'}
              >
                处理
              </a>
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>

            <Divider style={{ marginBottom: 32 }} />

            <StandardTable
              selectedRows={[]}
              loading={loading}
              data={alarmData}
              columns={columns}
              rowKey={record => record.alarmId}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 1500 }}
              noSelect={ true }
            />
          </div>
        </Card>
        <AlarmDetailModal
          modalVisible={alarmDetailVisible}
          handleModalVisible={this.handleAlarmDetailVisible}
        />
      </Fragment>
    );
  }
}
