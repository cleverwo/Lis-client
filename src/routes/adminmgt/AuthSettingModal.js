import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva/index';
import { injectIntl } from 'react-intl';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({ authSetting }) => ({
  authSetting,
}))
@injectIntl
class AuthSettingModal extends Component {
  hideModelHandler = () => {
    this.props.dispatch({
      type: 'authSetting/setModal',
      payload: {
        modalVisible: false,
        isEdit: false,
      },
    });
    this.props.dispatch({
      type: 'authSetting/setRecord',
      payload: {},
    });
    this.props.form.resetFields();
  };

  okHandler = () => {
    this.props.form.validateFields((errors, values) => {
      console.log(errors);
      if (errors) {
        return;
      }
      this.handleSubmit(values);
      this.hideModelHandler();
    });
  };

  cancelHandler = () => {
    this.hideModelHandler();
  };

  handleSubmit = values => {
    const { authSetting: { isEdit } } = this.props;
    console.log(isEdit);
    /*如果为编辑弹窗*/
    if (isEdit) {
      const { authSetting: { record } } = this.props;
      let isAuthModify =
        record.permissionName !== values.permissionName ||
        record.permissionDesc !== values.permissionDesc;
      const data = {
        id: isAuthModify ? record.id : undefined,
        permissionName:
          record.permissionName === values.permissionName ? undefined : values.permissionName,
        permissionDesc:
          record.permissionDesc === values.permissionDesc ? undefined : values.permissionDesc,
      };
      if (!isAuthModify) {
        console.log('no value changed!!');
        return;
      }
      this.props.onUpdateSubmit(data);
    } else {
      const data = values;
      this.props.onAddSubmit(data);
    }
  };

  handleAuthName = (rule, value, callback) => {
    const { dispatch, authSetting: { record, isEdit }, intl } = this.props;
    //判断是不是编辑，是编辑校验名称修改过吗
    if (isEdit) {
      if (record.permissionName !== value) {
        if (value === undefined || value === '') {
          console.log('no name');
          callback(intl.formatMessage({ id: 'authMgt.authNameAlert' }));
        } else {
          dispatch({
            type: 'authSetting/authNameCheck',
            payload: value,
            callback: callback,
          });
        }
      } else {
        callback();
      }
    } else {
      if (value === undefined || value === '') {
        console.log('no name');
        callback(intl.formatMessage({ id: 'authMgt.authNameAlert' }));
      } else {
        dispatch({
          type: 'authSetting/authNameCheck',
          payload: value,
          callback: callback,
        });
      }
    }
  };

  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const { authSetting: { record, isEdit, modalVisible, isUpdate }, intl } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <span>
        <Modal
          title={
            isEdit
              ? intl.formatMessage({ id: 'authMgt.authEdit' })
              : intl.formatMessage({ id: 'authMgt.authCreate' })
          }
          visible={modalVisible}
          onOk={this.okHandler}
          onCancel={() => this.cancelHandler()}
          destroyOnClose={true}
          afterClose={resetFields}
          footer={isUpdate === true ? undefined : null}
          maskClosable={false}
        >
          <div>
            <Form>
              <div style={{ display: 'none' }}>
                <FormItem>
                  {getFieldDecorator('id', {
                    initialValue: isEdit ? record.id : undefined,
                    rules: [{ required: false, message: '' }],
                  })(<Input />)}
                </FormItem>
              </div>
              <FormItem {...formItemLayout} label={intl.formatMessage({ id: 'authMgt.authName' })}>
                {getFieldDecorator('permissionName', {
                  initialValue: isEdit ? record.permissionName : undefined,
                  rules: [
                    { required: true, message: intl.formatMessage({ id: 'authMgt.authNameTip' }) },
                    { validator: this.handleAuthName },
                  ],
                })(
                  <Input
                    maxLength={60}
                    placeholder={intl.formatMessage({ id: 'authMgt.authNameTip' })}
                    disabled={!isUpdate}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={intl.formatMessage({ id: 'authMgt.authDescription' })}
              >
                {getFieldDecorator('permissionDesc', {
                  initialValue: isEdit ? record.permissionDesc : undefined,
                  rules: [{ required: false, message: '' }],
                })(
                  <TextArea
                    placeholder={intl.formatMessage({ id: 'authMgt.please.input.desc' })}
                    maxLength={250}
                    disabled={!isUpdate}
                  />
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AuthSettingModal);
