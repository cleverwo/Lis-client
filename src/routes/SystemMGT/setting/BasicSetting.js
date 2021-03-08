import React, { Component, Fragment } from 'react';
import { Button, Card, Form, Input } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ userSetting }) => ({
  userSetting,
}))
@Form.create()
export default class BasicSetting extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userSetting/getUserInfo',
    });
  }

  // 提交修改信息
  handleSubmit = e => {
    const { dispatch, userSetting: { userInfo } } = this.props;
    const { validateFields } = this.props.form;
    e.preventDefault();
    validateFields((err, values) => {
      let isModify = values.name !== userInfo.name || values.telephone !== userInfo.telephone;
      if (isModify) {
        if (!err) {
          dispatch({
            type: 'userSetting/updateUserInfo',
            payload: values,
          });
        }
      }
    });
  };

  render() {
    const { submitting, userSetting: { userInfo } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4, offset: 1 },
      wrapperCol: { span: 8 },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Fragment>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label="登录账号">
              {userInfo.loginName}
            </Form.Item>
            <Form.Item {...formItemLayout} label="所属公司">
              {userInfo.companyName}
            </Form.Item>
            <FormItem {...formItemLayout} label="姓名" required={true}>
              {getFieldDecorator('name', { initialValue: userInfo.name })(
                <Input placeholder="输入个人姓名" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号" required={true}>
              {getFieldDecorator('telephone', {
                initialValue: userInfo.telephone,
                rules: [
                  {
                    required: true,
                    message: '输入正确的手机号格式',
                    pattern: new RegExp('^1([38]\\d|5[0-35-9]|7[3678])\\d{8}$'),
                  },
                ],
              })(<Input placeholder="输入手机号" />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('id', { initialValue: userInfo.id })(
                <Input disabled={true} type="hidden" />
              )}
            </FormItem>
          </Form>
        </Card>
      </Fragment>
    );
  }
}
