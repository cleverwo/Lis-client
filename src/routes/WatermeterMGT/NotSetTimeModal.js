import React, {Component} from 'react';
import {Modal, Upload, Button, Row, Col} from 'antd';
import {connect} from 'dva/index';

@connect(({waterMeter}) => ({
  waterMeter
}))
export default class NotSetTimeModal extends Component {
  /*确认按钮*/
  okHandler = e => {
    const {onSubmit} = this.props;
    e.preventDefault();
    onSubmit();
  };

  cancelHandler = () => {
    const { dispatch, handleModalVisible } = this.props;
    dispatch({
      type: 'waterMeter/setUploading',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/setFileList',
      payload: [],
    });
    dispatch({
      type: 'waterMeter/setSetTimeResult',
      payload: '',
    });
    handleModalVisible(false);
  };

  searchHandler = () => {
    const { dispatch, waterMeter: { fileList } } = this.props;
    const formData = new FormData();
    formData.append('file', fileList[0]);
    dispatch({
      type: 'waterMeter/findNotSetTimeMeter',
      payload: formData,
    });
  };

  render() {
    const {
      modalVisible,
      dispatch,
      waterMeter: { uploading, fileList, setTimeResult }
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
        title="查看下发时间结果"
        visible={modalVisible}
        onCancel={this.cancelHandler}
        destroyOnClose={true}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={this.cancelHandler}>取消</Button>,
        ]}
      >
        <div>
          <Row style={{marginBottom: 30}}>
            <Col span={5}>水表账号</Col>
            <Col span={14}>
              <Upload {...props}>
                <Button icon="upload">选择文件</Button>
              </Upload>
            </Col>
            <Col span={5}>
              <Button
                type="primary"
                onClick={this.searchHandler}
                disabled={fileList.length === 0}
                loading={ uploading }>{uploading ? '上传中' : '查询'}</Button>
            </Col>
          </Row>
          <p>未上报水表表号：</p>
          <p>{setTimeResult}</p>
        </div>
      </Modal>
    );
  }
}
