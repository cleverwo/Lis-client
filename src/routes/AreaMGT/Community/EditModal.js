import React,{Component} from "react";
import {Input, Modal ,Form} from "antd";
import AddressCascader from "../../Components/AddressCascader";
import {connect} from "dva";

const TextArea = Input.TextArea;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({community, user,}) => ({
  community,
  authorities: user.authorities,
}))
@Form.create()
export default class EditModal extends Component{

  okHandler = () =>{
    console.log("提交")
    const {validateFields} = this.props.form;
    const { handleModalVisible,onSubmit,community:{record}} = this.props;
    validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        areaCode: (fieldsValue.addressCode && fieldsValue.addressCode.length > 2) ? fieldsValue.addressCode[2] : undefined,
      };
      console.log(values)
      let isModify =
        fieldsValue.name !== record.name ||
        values.areaCode !== record.areaCode ||
        fieldsValue.description !== record.description;
      if (!isModify) {
        console.log('没有修改');
      }else{
        onSubmit(values);
      }
      handleModalVisible(false);
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
    const {modalVisible,handleModalVisible,community:{record}} = this.props;
    const {getFieldDecorator} = this.props.form;

    return(
      <Modal
        title="编辑区域"
        visible={modalVisible}
        onOk={this.okHandler}
        onCancel={() => handleModalVisible(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div>
          <Form layout="vertical">
            <Form.Item {...formItemLayout} label="">
              {getFieldDecorator('id', {
                initialValue: record.id,
              })(<Input disabled={true} type="hidden" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="区域名称">
              {getFieldDecorator('name', {
                initialValue: record.name,
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
                initialValue: record.addressCode,
                rules: [
                  {
                    required: true,
                    message: "详细地址不能为空"
                  },
                  {validator: this.validAddressCode},
                ],
              })(
                <AddressCascader values/>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="描述">
              {getFieldDecorator('description', {
                initialValue: record.description,
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
