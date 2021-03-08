import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Table, message} from "antd";
import StandardTable from "../../../components/StandardTable";
import {filterNullFields} from "../../../utils/utils";
import moment from "moment";
import styles from "./style.less";
import exportExcel from '../../../utils/exportExcel';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

@connect(({payStatistics, user}) => ({
  payStatistics,
  authorities: user.authorities,
}))
@Form.create()
class OffLineStatistics extends Component {

  state = {
    viewModalVisible: false,
    formValues: {},
    values: '',
  };

  componentWillMount() {
    const {dispatch} = this.props;
    //查线下统计
    dispatch({
      type: 'payStatistics/fetchOffLineStatistics',
      payload: {
        payWay: "OffLine"
      },
    });
  }

  //查询
  handleSearch = (e) => {
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
      const values = {
        ...fieldsValue,
        updateAt: fieldsValue.updateAt && fieldsValue.updateAt.valueOf()
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'payStatistics/fetchOffLineStatistics',
        payload: {
          ...values,
          payWay: "OffLine"
        },
      });
    });
  };

  //重置查询
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'payStatistics/fetchOffLineStatistics',
      payload: {
        payWay: "OffLine"
      },
    });
  };

  //查看
  showViewModal = record => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const values = {
      ...formValues,
      priceId: record.priceId,
      payWay: "OffLine",
    };
    dispatch({
      type: 'payStatistics/viewStatistics',
      payload: values,
      callback: () => {
        this.setState({
          viewModalVisible: true,
        });
      }
    });
    this.setState({
      values: this.urlEncode(values),
    });
  };

  //关闭查看
  closeViewModal = () => {
    const {dispatch} = this.props;
    this.setState({
      viewModalVisible: false,
    });
    dispatch({
      type: 'payStatistics/setViewOffLineData',
      payload: {},
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

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const {subordinate} = this.props;
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
                    <Select.Option key={item.id} value={item.id}>
                      {item.userName}
                    </Select.Option>
                  ))}
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
                <Button style={{marginLeft: 8}} onClick={() => this.handleFormReset()}>
                  重置
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {loading, payStatistics: {OffLineData}} = this.props;
    const {formValues} = this.state;

    let goodsData = OffLineData.list;
    if (goodsData.length) {
      let num = 0;
      let amount = 0;
      goodsData.forEach(item => {
        num += Number(item.orderNumber);
        amount += (Number(item.money) * 100);
      });
      amount /= 100;
      goodsData = goodsData.concat({
        priceId: "总计",
        orderNumber: num,
        money: amount,
      });
    }

    const data2 = {
      list: goodsData,
      pagination: OffLineData.pagination,
    };

    let exportParam = {
      ...formValues,
      payWay: "OffLine",
    };
    exportParam = this.urlEncode(exportParam);


    const moneyColumns = [
      {
        title: '编号',
        dataIndex: 'priceId',
        key: 'priceId',
        render: (text, row, index) => {
          if (index < OffLineData.list.length) {
            return <span>{text}</span>
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
        title: '用水性质',
        dataIndex: 'priceName',
        key: 'priceName',
      },
      {
        title: '单数',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        render: (text, row, index) => {
          if (index < OffLineData.list.length) {
            return <span>{text} 单</span>;
          }
          return <span style={{fontWeight: 600}}>{text} 单</span>;
        },
      },
      {
        title: '金额',
        dataIndex: 'money',
        key: 'money',
        render: (text, row, index) => {
          if (index < OffLineData.list.length) {
            return <span>{text} 元</span>;
          }
          return <span style={{fontWeight: 600}}>{text} 元</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index) => {
          if (index < OffLineData.list.length) {
            return <span>
              <a type="dashed" onClick={() => this.showViewModal(row)}>
              查看
              </a>
          </span>
          }
          return <span style={{fontWeight: 600}}>无</span>;
        },
      },
    ];

    return (
      <div>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </div>
        <Button
          href={`/admin/record/payStatistics/viewStatisticsExcel/export?${exportParam}`}
          style={{marginRight: 8, marginBottom: 4}}
          icon="download"
        >{"导出报表"}</Button>
        <StandardTable
          selectedRows={[]}
          rowKey={record => record.CreateTime}
          loading={loading}
          columns={moneyColumns}
          data={data2}
          onChange={null}
          scroll={{x: 1200}}
          noSelect={true}
        />
        <OffLineViewModal
          modalVisible={this.state.viewModalVisible}
          handleModalVisible={this.closeViewModal}
          values={this.state.values}
        />
      </div>
    );
  };
}

export default OffLineStatistics;

@connect(({payStatistics}) => ({
  payStatistics,
}))
class OffLineViewModal extends Component {

  //转换list为string
  ListToString = (list) => {
    let i = 0;
    let result = "";
    for (i = 0; i < list.length; i++) {
      result = result + list[i].priceName + ":" + "￥" + list[i].priceAmount + " ";
    }
    return result;
  };

  // 批量导出事件
  // handleExportClick = (columns, data, name) => {
  //   const rows = [];
  //   console.log("打印的数据为", data);
  //   data.forEach((val, index) => {
  //     console.log("values --->", val)
  //     const child = {
  //       index: index + 1,
  //       time: val.time,
  //       meterCode: val.meterCode,
  //       payAmount: '￥' + val.payAmount,
  //       waterAmount: val.waterAmount + 'm³',
  //       waterPrice: '￥' + val.waterPrice,
  //       additionalPrice: '￥' + val.additionalPrice,
  //       composeList: this.ListToString(val.composeList),
  //       operatorName: val.operatorName
  //     };
  //     rows.push(child);
  //   });
  //   console.log("打印的数据组织为", rows);
  //   exportExcel(columns, rows, name + ".xlsx");
  // };

  render() {
    const {modalVisible, handleModalVisible, payStatistics: {viewOffLineData},values } = this.props;
    const columns = [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 70,
        render: (text, row, index) => {
          if (index < viewOffLineData.length) {
            return <span>{index + 1}</span>
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
        title: '日期',
        dataIndex: 'time',
        key: 'time',
        width: 180,
      },
      {
        title: '水表',
        dataIndex: 'meterCode',
        key: 'meterCode',
        width: 150,
      },
      {
        title: '订单金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: 90,
        render: val => <span>￥ {val}</span>
      },
      {
        title: '买水量',
        dataIndex: 'waterAmount',
        key: 'waterAmount',
        width: 100,
        render: val => <span>{val} m³</span>
      },
      {
        title: '水费金额',
        dataIndex: 'waterPrice',
        key: 'waterPrice',
        width: 100,
        render: val => <span>￥ {val}</span>
      },
      {
        title: '附加费金额',
        dataIndex: 'additionalPrice',
        key: 'additionalPrice',
        width: 150,
        render: val => <span>￥ {val}</span>
      },
      {
        title: '附加费详情',
        dataIndex: 'composeList',
        key: 'composeList',
        render: val => <span>{this.ListToString(val)}</span>
      },
      {
        title: '收费人员',
        dataIndex: 'operatorName',
        key: 'operatorName',
        width: 150,
      },
    ];
    return (
      <Modal
        title="单据详情"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        width="80%"
        destroyOnClose={true}
        footer={null}
      >
        <div>
          <a type="dashed" href={`/admin/record/payStatistics/viewStatisticsExcel/export?${values}`}>
            打印
          </a>
          <Table
            columns={columns}
            dataSource={viewOffLineData}
            pagination={{pageSize: 50}}
            scroll={{y: 240}}
          />,
        </div>
      </Modal>
    );
  };
}
