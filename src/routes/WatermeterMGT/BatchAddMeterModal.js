import React, {Component} from 'react';
import {Form, Input, Modal, Select, Upload, Button, Row, Col, Radio} from 'antd';
import {connect} from 'dva/index';
import FiveAddressCascader from "../Components/FiveAddressCascader";

const Option = Select.Option;
const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({waterMeter, waterPrice, product}) => ({
  waterMeter,
  waterPrice,
  product,
}))
class BatchAddMeterModal extends Component {
  state = {
    meterCodeValid: new RegExp('^\\d{12}$'),
    meterCodeMessage: '水表账号为12位数字',
    meterCodeNumber: 12,
    ctwingStatus: false,
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'waterPrice/fetchList',
    });
    //获取产品列表
    this.props.dispatch({
      type: 'product/fetchList'
    });
  }

  /*确认按钮*/
  okHandler = e => {
    const {validateFields} = this.props.form;
    const {handleModalVisible, onSubmit} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let data ={};
        if (!values.ctwingStatus){
          data = {
            ...values,
            productId: 0
          }
        }
        onSubmit(data);
      }
    });
  };

  /* 水表地址校验*/
  validAddress = (rule, value,callback) => {
    if (value === undefined || value.length < 5) {
      return callback("地址需要精确到楼栋")
    }
    callback();
  };

  setValid = e => {
    const {resetFields} = this.props.form;
    //console.log("单选框的值 "+e.target.value);
    if (e.target.value === 'teleCom') {
      this.setState({
        meterCodeValid: new RegExp('^[0-9]{12}|([0-9]{15})$'),
        meterCodeNumber: 15,
        meterCodeMessage: '水表账号为12-15位数字',
        ctwingStatus: true,
      });
    } else {
      this.setState({
        meterCodeValid: new RegExp('^\\d{12}$'),
        meterCodeNumber: 12,
        meterCodeMessage: '水表账号为12位数字',
        ctwingStatus: false,
      });
    }
    resetFields('meterCode');
  };

  render() {
    const {
      modalVisible,
      handleModalVisible,
      waterPrice: { waterPriceList },
      dispatch,
      waterMeter: { uploading, fileList },
      product: {productList},
    } = this.props;
    const {getFieldDecorator} = this.props.form;
    const props = {
      onRemove: (file) => {
        dispatch({
          type: 'waterMeter/setFileList',
          payload: [],
        });
      },
      beforeUpload: (file) => {
        dispatch({
          type: 'waterMeter/setFileList',
          payload: [file],
        });
        return false;
      },
      fileList,
    };

    return (
      <Modal
        title="批量新增水表"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={() => handleModalVisible(false)}>取消</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.okHandler}
            disabled={fileList.length === 0}
            loading={ uploading }>{uploading ? '上传中' : '确定'}</Button>
        ]}
      >
        <div>
          <Row style={{marginBottom: 30}}>
            <Col span={5}>水表账号</Col>
            <Col span={19}>
              <Upload {...props}>
                <Button icon="upload">选择文件</Button>
              </Upload>
            </Col>
          </Row>
          <Form layout="vertical">
            {this.state.ctwingStatus ?
              <Form.Item {...formItemLayout} label="产品名称">
                {getFieldDecorator('productId', {
                  rules: [
                    {
                      required: this.state.ctwingStatus,
                      message: '所属产品不能为空',
                    },
                  ],
                })(
                  <Select placeholder="选择产品信息">
                    {productList.map(item => (
                      <Option key={item.productId} value={item.productId}>
                        {item.productName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item> : ""
            }
            <Form.Item {...formItemLayout} label="水表平台">
              {getFieldDecorator('meterPlatform', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Radio.Group onChange={this.setValid}>
                <Radio value="teleCom">电信平台</Radio>
                <Radio value="local">本地平台</Radio>
              </Radio.Group>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="用水性质">
              {getFieldDecorator('waterPriceId', {
                rules: [
                  {
                    required: true,
                    message: "用水性质不能为空"
                  },
                ],
              })(
                <Select placeholder="选择水价">
                  {waterPriceList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.typeName}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="水表地址">
              {getFieldDecorator('waterMeterAddress', {
                rules: [
                  {
                    required: true,
                    message: '选择水表地址',
                  },
                  {validator: this.validAddress},
                ],
              })(
                <FiveAddressCascader/>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<TextArea rows="2" cols="30" placeholder="请输入"/>)}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(BatchAddMeterModal);
