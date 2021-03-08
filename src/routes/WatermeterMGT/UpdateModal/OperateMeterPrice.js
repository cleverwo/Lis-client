import React, {Component} from 'react';
import {Form, Select, Card, Button, Row, Col} from 'antd';
import {connect} from 'dva';

const Option = Select.Option;

@connect(({waterMeter, waterPrice}) => ({
  waterMeter,
  waterPrice,
}))
class OperateMeterPrice extends Component {
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
export default Form.create()(OperateMeterPrice);
