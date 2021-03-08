import React, {PureComponent, Component} from 'react';
import {Form, Input, Select, Card, Button, Row, Col, InputNumber} from 'antd';
import {connect} from 'dva';
import moment from 'moment';

const Option = Select.Option;

class MeterOperateModal extends PureComponent {
  render() {
    const {callBackRefresh} = this.props;
    return (
      <div>
        <SettlementData/>
        <StandardTime/>
       {/* <ValueControl callBackRefresh={callBackRefresh}/>*/}
       {/* <WaterMeterBalance/>*/}
        {/*<WaterMeterPrice/>*/}
        <WaterMeterAddress/>
        <SyncData/>
        <SubmissionTime/>
       {/* <IpAddress/>*/}
        <WarnParameter/>
      {/*  <Offline/>*/}
      </div>
    );
  }
}

export default Form.create()(MeterOperateModal);

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class SettlementData extends Component {
  state = {
    DaySearch: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17',
      '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28',],
    MonthSearch: [],
    ShowMonth: false,
  };

  /*下发结算日*/
  handleBalanceDate = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        const balanceMonthDate = values.balanceMonthDate?values.balanceMonthDate:'00';
        const data = balanceMonthDate+values.balanceDayDate;
        console.log("下发的具体数据为：",data);
        dispatch({
          type: 'waterMeter/settlementDate',
          payload: {
            balanceDateType: values.balanceDateType,
            balanceDate: data+"",
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发结算日*/
  reSetBalanceDate = e => {
    e.preventDefault();
    console.log('重置');
    this.setState({
      ShowMonth: false,
    });
    this.props.form.resetFields();
  };

  /*结算日期类型选择动态添加结算日下拉框*/
  handleBalanceValue = value => {
    const OneMonthEnd = [];
    const QuarterEnd = [{month:'00',value: '第一个月'}, {month:'01',value: '第二个月'}, {month:'02',value: '第三个月'}];
    const YearEnd = [{month:'01',value: '一月'}, {month:'02',value: '二月'},{month:'03',value: '三月'},{month:'04',value: '四月'},
      {month:'05',value: '五月'},{month:'06',value: '六月'},{month:'07',value: '七月'},{month:'08',value: '八月'},
      {month:'09',value: '九月'},{month:'10',value: '十月'},{month:'11',value: '十一月'},{month:'12',value: '十二月'}];
    switch (value) {
      case '01':
        this.setState({
          MonthSearch: OneMonthEnd,
          ShowMonth: true,
        });
        break;
      case '02':
        this.setState({
          MonthSearch: QuarterEnd,
          ShowMonth: false,
        });
        break;
      case '03':
        this.setState({
          MonthSearch: YearEnd,
          ShowMonth: false,
        });
        break;
      default:
        this.props.form.resetFields(['balanceMonthDate'], ['balanceDayDate']);
    }
    this.props.form.resetFields(['balanceMonthDate'], ['balanceDayDate']);
    return;
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Card title="下发结算日" bordered={false} size="small">
        <Form onSubmit={this.handleBalanceDate} hideRequiredMark id="1">
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 10}} wrapperCol={{span: 14}} label="结算日期类型">
                {getFieldDecorator('balanceDateType', {
                  rules: [
                    {
                      required: true,
                      message: '选择结算类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择" onChange={value => this.handleBalanceValue(value)}>
                    <Option key="01" value="01">
                      月结
                    </Option>
                    <Option key="02" value="02">
                      季结
                    </Option>
                    <Option key="03" value="03">
                      年结
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 10}} label="结算月">
                {getFieldDecorator('balanceMonthDate', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: !this.state.ShowMonth,
                      message: '结算月份不能空',
                    },
                  ],
                })(
                  <Select disabled={this.state.ShowMonth}>
                    {this.state.MonthSearch.map(item => (
                      <Option key={item.month} value={item.month}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 10}} label="结算日">
                {getFieldDecorator('balanceDayDate', {
                  initialValue: undefined,
                  rules: [
                    {
                      required: true,
                      message: '结算日不能空',
                    },
                  ],
                })(
                  <Select>
                    {this.state.DaySearch.map(type => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.reSetBalanceDate}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class StandardTime extends Component {
  state = {
    newDate: new Date(),
  };

  /*下发标准时间*/
  handleStandardTime = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/standardTime',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发标准时间*/
  resetStandardTime = e => {
    e.preventDefault();
    console.log('重置下发标准时间');
    this.setState({
      newDate: new Date(),
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Card title="下发标准时间" bordered={false} size="small">
        <Form onSubmit={this.handleStandardTime} hideRequiredMark>
          <Row gutter={3}>
            <Col span={9}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="当前时间：">
                {getFieldDecorator('time', {
                  initialValue: moment(this.state.newDate).format('YYYY-MM-DD HH:mm:ss'),
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<Input disabled={true}/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetStandardTime}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}


@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class ValueControl extends Component {

  /*下发阀门控制*/
  handleValueControl = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}, callBackRefresh} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/valueControl',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
          callback: callBackRefresh
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发标准时间*/
  resetValueControl = e => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <Card title="下发阀门控制" bordered={false} size="small">
        <Form onSubmit={this.handleValueControl} hideRequiredMark>
          <Row gutter={3}>
            <Col span={9}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="控制命令：">
                {getFieldDecorator('state', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option key="10" value="10">
                      强制开阀
                    </Option>
                    <Option key="20" value="20">
                      强制关阀
                    </Option>
                    <Option key="40" value="40">
                      取消强制
                    </Option>
                    <Option key="00" value="00">
                      表示无动作
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetValueControl}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}


@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class WaterMeterBalance extends Component {
  /*重置余额为0*/
  handleWaterMeterBalance = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        const data = {
          waterBalance: values.waterBalance * 100,
          meterId: record.id,
          meterCode: record.meterCode,
        };
        console.log('dfdfdfdfdfdf', data);
        dispatch({
          type: 'waterMeter/waterMeterBalance',
          payload: data,
        });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {waterMeter: {record}} = this.props;
    return (
      <Card title="重置余额为0" bordered={false} size="small">
        <Form onSubmit={this.handleWaterMeterBalance} hideRequiredMark>
          <Row gutter={3}>
            <Col span={9}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="水费余额：">
                {getFieldDecorator('waterBalance', {
                  initialValue: -record.waterBalance,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(<InputNumber step={0.01} disabled={true}/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Button type="primary" htmlType="submit">
                重置余额为0
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter, waterPrice}) => ({
  waterMeter,
  waterPrice,
}))
@Form.create()
class WaterMeterPrice extends Component {
  /*下发标准时间*/
  handleWaterMeterPrice = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/waterMeterPrice',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {waterMeter: {record}, waterPrice: {waterPriceList}} = this.props;
    return (
      <Card title="下发水表阶梯水价" bordered={false} size="small">
        <Form onSubmit={this.handleWaterMeterPrice} hideRequiredMark>
          <Row gutter={3}>
            <Col span={9}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="计费标准：">
                {getFieldDecorator('waterPriceId', {
                  initialValue: record.waterPriceId,
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {waterPriceList.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.typeName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class WaterMeterAddress extends Component {
  /*下发水表新地址*/
  handleWaterMeterAddress = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/waterMeterAddress',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置水表新地址*/
  resetWaterMeterAddress = e => {
    e.preventDefault();
    console.log('重置水表新地址');
    this.props.form.resetFields();
  };

  /* 水表账号名称校验*/
  timeout;
  validMeterCode = (rule, value, callback) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (value === undefined || value.trim() === '') {
      callback();
      return;
    }
    this.timeout = setTimeout(() => {
      return this.validCode(value, callback);
    }, 300);
  };

  /* 校验水表账号唯一性 */
  validCode = (value, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/validMeterCode',
      payload: value,
      callback: callback,
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发水表新地址" bordered={false} size="small">
        <Form onSubmit={this.handleWaterMeterAddress} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="水表账号">
                {getFieldDecorator('newMeterCode', {
                  rules: [
                    {
                      required: true,
                      message: '输入14位数字',
                      pattern: new RegExp('^\\d{12}$'),
                    },
                    {validator: this.validMeterCode},
                  ],
                })(<Input maxLength={12}/>)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetWaterMeterAddress}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class SyncData extends Component {
  /*下发机电同步数据*/
  handleSyncData = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/syncData',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发机电同步数据*/
  resetSyncData = e => {
    e.preventDefault();
    console.log('重置下发机电同步数据');
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发机电同步数据" bordered={false} size="small">
        <Form onSubmit={this.handleSyncData} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="同步水表底数">
                {getFieldDecorator('synData', {
                  rules: [
                    {
                      required: true,
                      message: '输入6位数字',
                      pattern: new RegExp('^\\d{6}$'),
                    },
                  ],
                })(<Input maxLength={6}/>)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetSyncData}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class SubmissionTime extends Component {
  /*下发上报时间*/
  handleSubmissionTime = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/submissionTime',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发上报时间*/
  resetSubmissionTime = e => {
    e.preventDefault();
    console.log('重置下发上报时间');
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发上报时间" bordered={false} size="small">
        <Form onSubmit={this.handleSubmissionTime} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="间隔类型">
                {getFieldDecorator('reportTimeType', {
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    <Option key="01" value="01">
                      每小时上报
                    </Option>
                    <Option key="02" value="02">
                      每天上报
                    </Option>
                    <Option key="03" value="03">
                      每周上报
                    </Option>
                    <Option key="04" value="04">
                      每月上报
                    </Option>
                    <Option key="05" value="05">
                      间隔分钟上报
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="上报时间">
                {getFieldDecorator('reportTime', {
                  rules: [
                    {
                      required: true,
                      message: '上报时间为8位数字',
                      pattern: new RegExp('^\\d{8}$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetSubmissionTime}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class IpAddress extends Component {
  /*下发IP地址*/
  handleIpAddress = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/ipAddress',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发IP地址*/
  resetIpAddress = e => {
    e.preventDefault();
    console.log('重置下发IP地址');
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发IP地址" bordered={false} size="small">
        <Form onSubmit={this.handleIpAddress} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="IP地址">
                {getFieldDecorator('ip', {
                  rules: [
                    {
                      required: true,
                      message: '输入有效的IP',
                      pattern: new RegExp(
                        '^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$'
                      ),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="用户名">
                {getFieldDecorator('userName', {
                  rules: [
                    {
                      required: true,
                      message: '用户名不能为空',
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="端口号">
                {getFieldDecorator('port', {
                  rules: [
                    {
                      required: true,
                      message: '输入4位数字',
                      pattern: new RegExp('^\\d{4}$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '密码不能为空',
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="APN">
                {getFieldDecorator('apn', {
                  rules: [
                    {
                      required: true,
                      message: 'APN不能为空',
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={3}>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetIpAddress}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class WarnParameter extends Component {
  /*下发告警参数*/
  handleWarnParameter = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/warnParameter',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发告警参数*/
  resetWarnParameter = e => {
    e.preventDefault();
    console.log('重置下发告警参数');
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发告警参数" bordered={false} size="small">
        <Form onSubmit={this.handleWarnParameter} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="囤积金额上限">
                {getFieldDecorator('hoardMoney', {
                  rules: [
                    {
                      required: true,
                      message: '输入小数(小数点后两位）',
                      pattern: new RegExp('^([0-9][0-9]*)+(.[0-9]{1,2})?$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="可透支下限">
                {getFieldDecorator('floorLimit', {
                  rules: [
                    {
                      required: true,
                      message: '输入小数点后两位',
                      pattern: new RegExp('^([0-9][0-9]*)+(.[0-9]{1,2})?$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="告警水量">
                {getFieldDecorator('waterAlarm', {
                  rules: [
                    {
                      required: true,
                      message: '输入整数',
                      pattern: new RegExp('^[0-9]*$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetWarnParameter}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}

@connect(({waterMeter}) => ({
  waterMeter,
}))
@Form.create()
class Offline extends Component {
  /*下发下线指令*/
  handleOffline = e => {
    const {validateFields} = this.props.form;
    const {dispatch, waterMeter: {record}} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values);
        dispatch({
          type: 'waterMeter/offline',
          payload: {
            ...values,
            meterId: record.id,
            meterCode: record.meterCode,
          },
        });
        this.props.form.resetFields();
      }
    });
  };

  /*重置下发下线指令*/
  resetOffline = e => {
    e.preventDefault();
    console.log('重置下发下线指令');
    this.props.form.resetFields();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title="下发下线指令" bordered={false} size="small">
        <Form onSubmit={this.handleOffline} hideRequiredMark>
          <Row gutter={3}>
            <Col span={7}>
              <Form.Item labelCol={{span: 9}} wrapperCol={{span: 14}} label="抄表时间">
                {getFieldDecorator('lineOff', {
                  rules: [
                    {
                      required: true,
                      message: '请输入8位数字',
                      pattern: new RegExp('^\\d{8}$'),
                    },
                  ],
                })(<Input/>)}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.resetOffline}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
