import React,{Component} from "react";
import {Form, Input, Modal} from "antd";
import AddressCascader from "../../Components/AddressCascader";

const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
export default class AddModal extends Component{

  okHandler = () =>{
    const {validateFields} = this.props.form;
    const { handleModalVisible,onSubmit} = this.props;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        areaCode: (fieldsValue.addressCode && fieldsValue.addressCode.length > 2) ? fieldsValue.addressCode[2] : undefined,
      };
      if (!err) {
        onSubmit(values);
        handleModalVisible(false);
      }
    });
  };

  /* 水表账号名称校验*/
  validAddressCode = (rule, value,callback) => {
    if (value === undefined || value.length < 3) {
      return callback("地址需要精确到区")
    }
    callback();
  };

  render(){
    const {modalVisible,handleModalVisible} = this.props;
    const {getFieldDecorator} = this.props.form;

    return(
      <Modal
        title="新增区域"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <Form.Item {...formItemLayout} label="区域名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '区域名称不能为空',
                  },
                ],
              })(<Input placeholder="请输入..."/>)}
            </Form.Item>
           <Form.Item {...formItemLayout} label="详细地址">
              {getFieldDecorator('addressCode', {
                rules: [
                  {
                    required: true,
                    message: "详细地址不能为空"
                  },
                 {validator: this.validAddressCode},
                ],
              })(
                <AddressCascader />
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
    )
  }
}

