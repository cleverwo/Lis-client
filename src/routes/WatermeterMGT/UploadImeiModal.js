import React, { Component } from 'react';
import { connect } from 'dva/index';
import {Button, Col, Modal, Row, Upload} from "antd";

@connect(({waterMeter}) => ({
  waterMeter
}))
export default class UploadImeiModal extends Component {
  /*确认按钮*/
  okHandler = e => {
    const {onSubmit} = this.props;
    e.preventDefault();
    onSubmit();
  };

  render() {
    const {
      modalVisible,
      handleModalVisible,
      dispatch,
      waterMeter: { uploading, fileList }
    } = this.props;

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
            <Col span={5}>IMEI号</Col>
            <Col span={19}>
              <Upload {...props}>
                <Button icon="upload">选择文件</Button>
              </Upload>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}
