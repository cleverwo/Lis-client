import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Cascader, Button, Card, Form, Input } from 'antd';
import Position from "../../utils/AntCascader";

const FormItem = Form.Item;

@connect(({ company, user }) => ({
  company,
  authorities: user.authorities,
}))
@Form.create()
export default class ThisCompany extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getThisCoInfo',
    });
  }

  // 提交修改公司信息
  handleSubmit = e => {
    const { validateFields } = this.props.form;
    const { dispatch, company: { thisCoInfo } } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let modify =
          values.coName !== thisCoInfo.coName ||
          values.province !== thisCoInfo.province ||
          values.city !== thisCoInfo.city ||
          values.area !== thisCoInfo.area ||
          values.address !== thisCoInfo.address ||
          values.coAccount !== thisCoInfo.coAccount;
        if (modify) {
          dispatch({
            type: 'company/updateThisCompany',
            payload: values,
          });
        }
      }
    });
  };

  render() {
    const { submitting, authorities, company: { thisCoInfo } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const isEdit = authorities.indexOf('am_thisCompany_edit') > -1;

    const formItemLayout = {
      labelCol: { span: 8, offset: 1 },
      wrapperCol: { span: 8 },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 14, offset: 11 },
      },
    };

    let defaultAddr = [thisCoInfo.province, thisCoInfo.city, thisCoInfo.area];

    return (
      <PageHeaderLayout title="本公司设置">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="公司名称" required={true}>
              {getFieldDecorator('name', { initialValue: thisCoInfo.coName })(
                <Input placeholder="输入公司名称" disabled={!isEdit} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="公司地址" required={true}>
              {getFieldDecorator('coAddress', {
                initialValue: defaultAddr,
                rules: [{
                  required:true,
                  message: '选择公司地址'
                }]
              })(
                <Cascader
                  placeholder="请选择"
                  showSearch
                  options={Position}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="详细地址" required={true}>
              {getFieldDecorator('address', { initialValue: thisCoInfo.address })(
                <Input placeholder="输入公司详细地址" disabled={!isEdit} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="公司财务账号" required={true}>
              {getFieldDecorator('companyAccount', { initialValue: thisCoInfo.coAccount })(
                <Input placeholder="输入公司财务账号" disabled={!isEdit} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="">
              {getFieldDecorator('id', { initialValue: thisCoInfo.coId })(
                <Input disabled={true} type="hidden" />
              )}
            </FormItem>
            {isEdit ? (
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  提交
                </Button>
              </FormItem>
            ) : (
              ''
            )}
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
