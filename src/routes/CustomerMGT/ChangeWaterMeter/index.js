import React, { PureComponent } from 'react';
import { Modal, Steps, Button, Input, Select, Form,Divider} from 'antd';
import { connect } from 'dva';
import FiveAddressCascader from "../../Components/FiveAddressCascader";

const TextArea = Input.TextArea;
const { Option } = Select;
const { Step } = Steps;
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

@connect(({ customer, waterMeter }) => ({
  customer,
  waterMeter,
}))
@Form.create()
export default class ChangeMeterModal extends PureComponent {
  state = {
    currentStep: 0,
  };

  /* 水表地址校验*/
  validAddress = (rule, value,callback) => {
    if (value === undefined || value.length < 5) {
      return callback("地址需要精确到楼栋")
    }
    callback();
  };

  //各个分部步骤的内容
  renderContent = (currentStep, changeMeterOld,changeMeterNew,meters) => {
    const { getFieldDecorator } = this.props.form;
    if (currentStep === 1) {
      return [
        <FormItem key="oldId" {...formLayout} label="">
          {getFieldDecorator('oldId', {
            initialValue: changeMeterOld.id,
          })(<Input disabled={true} hidden={true} />)}
        </FormItem>,
        <FormItem key="oldMeterCode" {...formLayout} label="旧水表编号">
          {getFieldDecorator('oldMeterCode', {
           initialValue: changeMeterOld.meterCode,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input disabled={true} placeholder="未获取账号码" />)}
        </FormItem>,
        <FormItem key="oldMeterAddress" {...formLayout} label="旧水表地址">
          {changeMeterOld.address + (changeMeterOld.description?changeMeterOld.description:' ')}
        </FormItem>,
        <FormItem key="oldMeterBalance" {...formLayout} label="旧水表余额">
          {changeMeterOld.waterBalance} ￥
        </FormItem>,
        <Divider style={{margin: '24px 0'}} />,
        <FormItem key="id" {...formLayout} label="">
          {getFieldDecorator('id', {
            initialValue: changeMeterNew.id,
          })(<Input disabled={true} hidden={true} />)}
        </FormItem>,
        <FormItem key="meterCode" {...formLayout} label="更换水表账号">
          {getFieldDecorator('meterCode', {
            initialValue: changeMeterNew.meterCode,
            rules: [
              {
                required: true,
                message: '水表账号为12位数字',
              },
            ],
          })(<Input disabled={true} />)}
        </FormItem>,
        <FormItem key="waterBalance" {...formLayout} label="水费余额">
          {changeMeterNew.waterBalance} ￥
        </FormItem>,
        <FormItem key="meterAddress" {...formLayout} label="水表地址">
          {getFieldDecorator('meterAddress', {
            rules: [
              {
                required: true,
                message: '水表地址不能为空',
              },
              {validator: this.validAddress},
            ],
          })(<FiveAddressCascader/>)}
        </FormItem>,
        <FormItem key="description" {...formLayout} label="门牌号">
          {getFieldDecorator('description', {
            initialValue: changeMeterNew.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea rows="2" cols="30" placeholder="请输入" />)}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="old" {...formLayout} label="需更换的水表编号">
        {getFieldDecorator('oldMeterCode', {
          rules: [
            { required: true, message: '需更换的水表编码不能为空'},
          ],
        })(<Select placeholder="请选择" style={{width: '100%'}} onChange={value=>{
          this.props.dispatch({
            type: 'customer/saveChangeMeterOld',
            payload: meters.filter(item => item.meterCode === value)[0],
          })
        }}>
          {meters.map(item => (
            <Option key={item.meterCode} value={item.meterCode}>
              {item.meterCode}
            </Option>
          ))}
        </Select>)}
      </FormItem>,
      <FormItem key="new" {...formLayout} label="更换为水表编号">
        {getFieldDecorator('meterCode', {
          rules: [
            { required: true, message: '水表账号为12位数字', pattern: new RegExp('^\\d{12}$') },
          ],
        })(<Input placeholder="请输入" maxLength={12} />)}
      </FormItem>
    ];
  };

  //modal框上一步按钮事件
  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  //modal框下一步按钮事件
  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  //选择水表的下一步按钮触发事件(第一个下一步）
  findMeterCode = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/findMeterCode',
      payload: data,
      callback: this.forward,
    });
  };

  //modal框提交按钮事件
  handleNext = currentStep => {
    const {form,onSubmit} = this.props;
    const that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const changeMeterData = { ...fieldsValue};
      this.setState(() => {
        switch (currentStep) {
          case 0:
            this.findMeterCode(fieldsValue); break;
          case 1:
            Modal.confirm({
              title: '确定更换水表吗?',
              content: '',
              onOk() {
                onSubmit(changeMeterData);
                that.handleModalVisible();
              },
              okText: '确定',
              cancelText: '取消',
            });
        }
      });
    });
  };

  //重写modal框底部按钮
  renderFooter = currentStep => {
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={this.handleModalVisible}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={this.handleModalVisible}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  //取消按钮
  handleModalVisible = () =>{
    const {handleModalVisible,dispatch} = this.props;
    //清空changOld 和changeNew
    dispatch({
      type: 'customer/saveChangeMeterNew',
      payload: {},
    });
    dispatch({
      type: 'customer/saveChangeMeterOld',
      payload: {},
    });
    //重置currentData
    this.setState({
      currentStep: 0,
    });
    //取消显示modal框
    handleModalVisible();
  };

  render() {
    const {
      modalVisible,
      customer: { changeMeterNew,record ,changeMeterOld},
    } = this.props;
    const { currentStep } = this.state;
    const meters = record.meters?record.meters: [];
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose={true}
        maskClosable={false}
        title="更换水表"
        visible={modalVisible}
        onCancel={this.handleModalVisible}
        footer={this.renderFooter(currentStep)}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="选择新水表" />
          <Step title="重置新水表信息" />
        </Steps>
        {this.renderContent(currentStep, changeMeterOld,changeMeterNew,meters)}
      </Modal>
    );
  }
}
