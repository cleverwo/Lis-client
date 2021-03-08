import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';

import RoleCreateModal from './RoleCreateModal';
import RoleUpdateModal from './RoleUpdateModal';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../../common/common.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ loading, role, userTransfer, user }) => ({
  role,
  userTransfer,
  authorities: user.authorities,
  loading: loading.models.role,
}))
@injectIntl
class RoleList extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    this.setSelectedRows([]);
    dispatch({
      type: 'role/fetch',
    });
  }

  // 列表的翻页和过滤排序
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, role: { formValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.columnKey) {
      params.sorter = `${sorter.columnKey}_${sorter.order}`;
    }

    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  };

  /*重置按钮*/
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setFormValues({});
    dispatch({
      type: 'role/fetch',
      payload: {},
    });
  };

  /*点击删除*/
  handleMenuClick = e => {
    const { dispatch, role: { selectedRows } } = this.props;
    if (!selectedRows) return;

    dispatch({
      type: 'role/remove',
      payload: selectedRows.map(row => row.id).join(','),
      callback: () => {
        this.callBackRefresh();
      },
    });
  };

  handleSelectRows = rows => {
    this.setSelectedRows(rows);
  };

  /*搜索*/
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setFormValues(values);

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  /*点击新建*/
  handleModalVisible = flag => {
    this.setCreateModalVisible(!!flag);
  };

  /*新建提交*/
  handleAdd = (fields, form) => {
    this.props.dispatch({
      type: 'role/add',
      payload: fields,
      callback: success => {
        this.callBackRefresh();
        this.setCreateModalVisible(!success);
        this.resetFormAfterDispatch(form, success);
      },
    });
  };

  /*更新提交*/
  handleUpdate = (fields, form) => {
    this.props.dispatch({
      type: 'role/update',
      payload: fields,
      callback: success => {
        this.callBackRefresh();
        this.setUpdateModalVisible(!success);
        this.resetFormAfterDispatch(form, success);
      },
    });
  };

  /*点击编辑*/
  handleEditModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const that = this;
    return () => {
      dispatch({
        type: 'role/saveUpdateRole',
        payload: record,
      });
      // 根据角色获取已经关联的人员，然后设置到UserTransfer中
      dispatch({
        type: 'role/fetchUserRoles',
        payload: record.id,
        callback: userRoles => {
          let userIds = [];
          userRoles.forEach(userRole => userIds.push(userRole.userId));
          dispatch({
            type: 'userTransfer/targetKeys',
            payload: userIds,
          });
          that.setUpdateModalVisible(flag);
        },
      });
    };
  };

  // 关闭编辑窗口
  hideUpdateModal = () => {
    const { dispatch } = this.props;
    this.setUpdateModalVisible(false);
    dispatch({
      type: 'role/saveUpdateRole',
      payload: {},
    });
    dispatch({
      type: 'userTransfer/clear',
    });
  };

  resetFormAfterDispatch(form, reset) {
    if (reset) {
      form.resetFields();
    }
  }

  setSelectedRows = selectedRows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/saveSelectedRows',
      payload: selectedRows,
    });
  };

  setFormValues = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setFormValues',
      payload: values,
    });
  };

  setCreateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setCreateModalVisible',
      payload: flag,
    });
  };

  setUpdateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setUpdateModalVisible',
      payload: flag,
    });
  };

  //新增、删除之后回调此函数，刷新列表
  callBackRefresh = () => {
    const { dispatch, form } = this.props;
    this.setSelectedRows([]);
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setFormValues(values);

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  //校验角色名称唯一性
  validRoleName = (value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/validRoleName',
      payload: value,
      callback: callback,
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'roleMgt.roleName' })}>
              {getFieldDecorator('roleName')(
                <Input placeholder={intl.formatMessage({ id: 'roleMgt.pleaseInput' })} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'roleMgt.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.formatMessage({ id: 'roleMgt.reset' })}
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //把列表中系统数据禁用编辑
  processData = data => {
    if (!data) {
      return data;
    }
    const { list, pagination } = data;
    let newList = list.map(item => {
      return { ...item, disabled: item.isSystem == 1 ? true : false };
    });
    return { list: newList, pagination };
  };

  render() {
    const { role: { data, selectedRows }, loading, intl, authorities } = this.props;
    const isCreate = authorities.indexOf('am_rolemgt_create') > -1 ? true : false;
    const isEdit = authorities.indexOf('am_rolemgt_edit') > -1 ? true : false;
    const isDelete = authorities.indexOf('am_rolemgt_delete') > -1 ? true : false;
    const columns = [
      {
        title: intl.formatMessage({ id: 'roleMgt.roleName' }),
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: intl.formatMessage({ id: 'roleMgt.description' }),
        dataIndex: 'roleDesc',
        align: 'center',
      },
      {
        title: intl.formatMessage({ id: 'roleMgt.operation' }),
        align: 'center',

        render: (text, record) => {
          if (record.isSystem) {
            return '系统数据禁止操作';
          } else {
            return (
              <span>
                <Button type="dashed" onClick={this.handleEditModalVisible(true, record)}>
                  {isEdit
                    ? intl.formatMessage({ id: 'roleMgt.edit' })
                    : intl.formatMessage({ id: 'roleMgt.view' })}
                </Button>
              </span>
            );
          }
        },
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleValidRoleName: this.validRoleName,
    };

    const parentMethodsForUpdate = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.hideUpdateModal,
      handleValidRoleName: this.validRoleName,
      isEdit: isEdit,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  {intl.formatMessage({ id: 'roleMgt.create' })}
                </Button>
              ) : (
                ''
              )}
              {selectedRows.length > 0 &&
                isDelete && (
                  <span>
                    <Button style={{ marginLeft: 5 }} icon="minus" onClick={this.handleMenuClick}>
                      {intl.formatMessage({ id: 'button.delete' })}
                    </Button>
                  </span>
                )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={this.processData(data)}
              columns={columns}
              rowKey={record => record.id}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{ x: 800 }}
            />
          </div>
        </Card>
        <RoleCreateModal {...parentMethods} dispatch={this.props.dispatch} />
        <RoleUpdateModal {...parentMethodsForUpdate} dispatch={this.props.dispatch} />
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(RoleList);
