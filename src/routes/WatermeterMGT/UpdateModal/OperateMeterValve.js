import React, {Component} from 'react';
import {Form, Select, Card, Button, Row, Col} from 'antd';
import {connect} from 'dva';

const Option = Select.Option;

@connect(({waterMeter}) => ({
  waterMeter,
}))
class OperateMeterValve extends Component {

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

export default Form.create()(OperateMeterValve);
