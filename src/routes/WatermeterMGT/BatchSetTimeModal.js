import React, {Component} from 'react';
import {Form, Modal, Upload, Button, Row, Col, InputNumber, TimePicker} from 'antd';
import {connect} from 'dva/index';

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
};

@connect(({waterMeter}) => ({
  waterMeter
}))
class BatchSetTimeModal extends Component {
  /*确认按钮*/
  okHandler = e => {
    const {validateFields} = this.props.form;
    const {onSubmit} = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  disabledHours = () => {
    return [0, 22, 23];
  };

  render() {
    const {
      modalVisible,
      handleModalVisible,
      dispatch,
      waterMeter: { uploading, fileList }
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
        title="批量下发上报时间"
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
            <Form.Item {...formItemLayout} label="开始时间">
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: "开始时间不能为空"
                  },
                ],
              })(
                <TimePicker format="h:mm" disabledHours={this.disabledHours} />
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="间隔时间（分钟）">
              {getFieldDecorator('interval', {
                rules: [
                  {
                    required: true,
                    message: "间隔时间（分钟）不能为空"
                  },
                ],
                initialValue:1,
              })(
                <InputNumber min={1} precision={0} step={1} />
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(BatchSetTimeModal);
