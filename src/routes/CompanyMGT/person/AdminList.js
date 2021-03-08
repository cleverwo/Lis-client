import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Row, Divider, Icon, Modal, Select } from 'antd';
import styles from '../../../common/common.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import { filterNullFields } from '../../../utils/utils';
import AdminModal from './AdminModal';
import moment from 'moment';

const FormItem = Form.Item;
@connect(({ person, user }) => ({
  person,
  authorities: user.authorities,
}))
@Form.create()
export default class AdminList extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/fetch',
    });
    dispatch({
      type: 'person/getCompanyList',
    });
    dispatch({
      type: 'person/getRoleList',
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
        type: 'person/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'person/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'person/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'person/fetch',
    });
  };

  //删除触发事件
  handleRemove = e => {
    e.preventDefault();
    const { dispatch, person: { selectedRows } } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除选中人员?',
      content: '',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'person/remove',
          payload: selectedRows,
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, person: { formValues } } = this.props;

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
      type: 'person/fetch',
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
        type: 'person/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'person/fetch',
        payload: values,
      });
    });
  };

  //设置查询条件是否展开
  saveExpandSearchForm = data => {
    this.props.dispatch({
      type: 'person/setExpandSearchForm',
      payload: data,
    });
  };

  /*点击新建*/
  handleModalVisible = flag => {
    this.setCreateModalVisible(!!flag);
  };

  /*新建提交*/
  handleAdd = (fields, form) => {
    this.props.dispatch({
      type: 'person/add',
      payload: fields,
      callback: success => {
        this.callBackRefresh();
        this.setCreateModalVisible(!success);
        this.resetFormAfterDispatch(success);
      },
    });
  };

  /*重置密码*/
  resetPassword = record => {
    const { dispatch } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定重置密码为123456?',
      content: '',
      onOk() {
        dispatch({
          type: 'person/resetPassword',
          payload: record.id,
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //校验角色名称唯一性
  validPersonName = (value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/validPersonName',
      payload: value,
      callback: callback,
    });
  };

  //修改显示modal的值
  setCreateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'person/setModalVisible',
      payload: flag,
    });
  };

  //重置查询框为空
  resetFormAfterDispatch = (reset) => {
    if (reset) {
      const { form } = this.props;
      form.resetFields();
    }
  };

  //选中行触发添加选中信息操作
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'person/setSelectRows',
      payload: rows,
    });
  };

  //返回搜索框信息
  renderForm() {
    return this.props.person.expandSearchForm ? this.renderAdvanceForm() : this.renderSimpleForm();
  }

  //未展开搜索框
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户姓名">
              {getFieldDecorator('userName')(<Input placeholder="输入用户姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入用户手机号" />)}
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
    const { person: { companyList, roleList } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="用户姓名">
              {getFieldDecorator('userName')(<Input placeholder="输入用户姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('phone')(<Input placeholder="输入用户手机号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="所属公司">
              {getFieldDecorator('coId')(
                <Select placeholder="选择公司">
                  {companyList.map(item => (
                    <Select.Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属角色">
              {getFieldDecorator('roleId')(
                <Select placeholder="输选择角色">
                  {roleList.map(item => (
                    <Select.Option key={item.roleId} value={item.roleId}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
    const { loading, person: { data, selectedRows, modalVisible }, authorities } = this.props;

    const isEdit = authorities.indexOf('am_companyMember_edit') > -1;
    const isCreate = authorities.indexOf('am_companyMember_create') > -1;
    const isDelete = authorities.indexOf('am_companyMember_delete') > -1;

    const columns = [
      {
        title: '登录名',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '所属公司',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '所属角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '登录时间',
        dataIndex: 'lastLoginOutTime',
        key: 'lastLoginOutTime',
        render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (operation, record) => (
          <div>{isEdit ? <a onClick={() => this.resetPassword(record)}>重置密码</a> : ''}</div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="人员列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增人员
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
        <AdminModal
          modalVisible={modalVisible}
          handleModalVisible={this.handleModalVisible}
          handleValid={this.validPersonName}
          onSubmit={this.handleAdd}
        />
      </PageHeaderLayout>
    );
  }
}
