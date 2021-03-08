import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Select,Row, Divider, Icon, Modal } from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { filterNullFields } from '../../utils/utils';
import { connect } from 'dva';
import StandardTable from '../../components/StandardTable';
import CustomerModal from './CustomerModal';
import { routerRedux } from 'dva/router';
import ChangeMeterModal from './ChangeWaterMeter/index';
import ViewModal from './ViewModal'
import FiveAddressCascader from "../Components/FiveAddressCascader";

const FormItem = Form.Item;
const transform = {
  IDCARD: '身份证',
  PASSPORT: '驾驶证',
  OTHER: '其他',
  '': '其他',
};
@connect(({ customer, company,user,loading }) => ({
  customer,
  company,
  authorities: user.authorities,
  loading: loading.effects['customer/fetch'],
}))
@Form.create()
export default class Customer extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetch',
    });
  }

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'customer/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'customer/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'customer/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'customer/fetch',
    });
  };

  //删除触发事件
  handleRemove = e => {
    e.preventDefault();
    const { dispatch, customer: { selectedRows } } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除选中用户?',
      content: '',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'customer/remove',
          payload: selectedRows.map(row => row.id).join(','),
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //用户开户
  openAccount = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/customer/register'));
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, customer: { formValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customer/fetch',
      payload: params,
    });
  };

  //回调 刷新列表
  callBackRefresh = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'customer/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'customer/setSelectRows',
        payload: [],
      });
      dispatch({
        type: 'customer/fetch',
        payload: values,
      });
    });
  };

  //设置查询条件是否展开
  saveExpandSearchForm = data => {
    this.props.dispatch({
      type: 'customer/setExpandSearchForm',
      payload: data,
    });
  };

  //显示编辑框
  showUpdateModal = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/saveCustomer',
      payload: record,
    });
    this.setCustomerEditModal(true);
  };

  //显示更改水表框
  showChangeMeterModal = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/saveCustomer',
      payload: record,
    });
    this.setCustomerChangeModal(true);
  };

  //取消显示更改水表框
  handleChangeMeterVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/saveCustomer',
      payload: {},
    });
    this.setCustomerChangeModal(false);
  };

  //更换水表确认按钮
  handleChangeMeterModal = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/changeMeterModal',
      payload: record,
      callback: this.handleEditCallback,
    });
  };

  /*点击查看*/
  showViewModal = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/saveCustomer',
      payload: record,
    });
    this.setCustomerViewModal(true);
  };

  //设置查看用户信息modal显示属性
  setCustomerViewModal = data =>{
    this.props.dispatch({
      type: 'customer/setViewModalVisible',
      payload: data,
    });
  };
  //设置编辑用户信息modal显示属性
  setCustomerEditModal = data =>{
    this.props.dispatch({
      type: 'customer/setModalVisible',
      payload: data,
    });
  };
  //设置更换水表modal显示属性
  setCustomerChangeModal = data =>{
    this.props.dispatch({
      type: 'customer/setChangeMeterVisible',
      payload: data,
    });
  };

  //取消显示编辑框
  handleModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/initCustomerInfo',
    });
    this.setCustomerEditModal(false);
  };

  //修改用户确定按钮
  handleEdit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/update',
      payload: record,
      callback: this.handleEditCallback,
    });
  };
  //修改用户回调
  handleEditCallback = () => {
    this.callBackRefresh();
    this.handleModalVisible();
  };

  //选中行触发添加选中信息操作
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'customer/setSelectRows',
      payload: rows,
    });
  };

  //返回搜索框信息
  renderForm() {
    return this.props.customer.expandSearchForm
      ? this.renderAdvanceForm()
      : this.renderSimpleForm();
  }

  //未展开搜索框
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户账户">
              {getFieldDecorator('customerCode')(<Input placeholder="输入用户账号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('customerName')(<Input placeholder="输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(true)}>
                展开
                <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //展开搜索框
  renderAdvanceForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户账户">
              {getFieldDecorator('customerCode')(<Input placeholder="输入用户账号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('customerName')(<Input placeholder="输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="水表编号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="详细地址">
              {getFieldDecorator('meterAddress')(<FiveAddressCascader/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={() => this.saveExpandSearchForm(false)}>
                收起
                <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      customer: { data, selectedRows, modalVisible, viewModalVisible, changeMeterVisible },
      authorities,
    } = this.props;

    console.log(data)

    const isEdit = authorities.indexOf('am_customer_edit') > -1;
    const isCreate = authorities.indexOf('am_customer_create') > -1;
    const isChangeMeter = authorities.indexOf('am_customer_changeMeter') > -1;
    const isDelete = authorities.indexOf('am_customer_delete') > -1;

    const columns = [
      {
        title: '用户账户',
        dataIndex: 'customerCode',
        key: 'customerCode',
      },
      {
        title: '用户名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '证件类型',
        dataIndex: 'certificateType',
        key: 'certificateType',
        render: record => transform[record],
      },
      {
        title: '证件号',
        dataIndex: 'certificateNumber',
        key: 'certificateNumber',
      },
      {
        title: '关联水表',
        dataIndex: 'meters',
        key: 'meters',
        render: record => record ? record.length : 0,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (operation, record) => (
          <div>
            <a onClick={() => this.showViewModal(record)}>查看</a>
            <Divider type="vertical" hidden={!isEdit} />
            {isEdit ? <a onClick={() => this.showUpdateModal(record)}>编辑</a> : ''}
            <Divider type="vertical" hidden={!isEdit} />
            {isChangeMeter ? <a onClick={() => this.showChangeMeterModal(record)}>更换水表</a> : ''}
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button icon="plus" type="primary" onClick={this.openAccount}>
                  用户开户
                </Button>
              ) : (
                ''
              )}
              {selectedRows.length > 0 &&
                isDelete && (
                  <span>
                    <Button icon="minus" onClick={this.handleRemove}>
                      删除
                    </Button>
                  </span>
                )}
            </div>
          </div>
          <Divider style={{ marginBottom: 32, marginTop: 0 }} />
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            rowKey={record => record.id}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>
        <CustomerModal
          onSubmit={this.handleEdit}
          modalVisible={modalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <ViewModal
          modalVisible={viewModalVisible}
          handleModalVisible={this.setCustomerViewModal}
        />
        <ChangeMeterModal
          modalVisible={changeMeterVisible}
          handleModalVisible={this.handleChangeMeterVisible}
          onSubmit={this.handleChangeMeterModal}
        />
      </PageHeaderLayout>
    );
  }
}
