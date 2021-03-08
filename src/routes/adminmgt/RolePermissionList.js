import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { injectIntl } from 'react-intl';

import RolePermissionCreateModal from './RolePermissionCreateModal';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../../common/common.less';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@injectIntl
@connect(({ loading, rolePermission, rolePermissionTree }) => ({
  rolePermission,
  rolePermissionTree,
  loading: loading.models.rolePermission,
}))
class RoleList extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    this.setSelectedRows([]);
    dispatch({
      type: 'rolePermission/fetch',
    });
  }

  // 列表的翻页和过滤排序
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, rolePermission: { formValues } } = this.props;

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
      type: 'rolePermission/fetch',
      payload: params,
    });
  };

  /*重置按钮*/
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setFormValues({});
    dispatch({
      type: 'rolePermission/fetch',
      payload: {},
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
        type: 'rolePermission/fetch',
        payload: values,
      });
    });
  };

  /*更新提交*/
  handleUpdate = (fields, form) => {
    this.props.dispatch({
      type: 'rolePermission/add',
      payload: fields,
      callback: success => {
        this.callBackRefresh();
        this.setUpdateModalVisible(!success);
        this.resetFormAfterDispatch(form, success);
      },
    });
  };

  /**
   * 点击设置权限
   */
  handleEditModalVisible = record => {
    const { dispatch } = this.props;
    const setUpdateModalVisible = this.setUpdateModalVisible;
    return () => {
      dispatch({
        type: 'rolePermission/saveUpdateRole',
        payload: record,
      });
      dispatch({
        type: 'rolePermissionTree/fetch',
        callback: () => {
          dispatch({
            type: 'rolePermission/fetchRoleFunctions',
            payload: record.id,
            callback: functions => {
              let functionIds = [];
              functions.forEach(data => functionIds.push(data.id));
              dispatch({
                type: 'rolePermissionTree/checkedKeys',
                payload: functionIds,
              });
              dispatch({
                type: 'rolePermissionTree/expandedKeys',
                payload: functionIds,
              });
              setUpdateModalVisible(true);
            },
          });
        },
      });
    };
  };

  // 关闭编辑窗口
  hideUpdateModal = () => {
    const { dispatch } = this.props;
    this.setUpdateModalVisible(false);
    dispatch({
      type: 'rolePermission/saveUpdateRole',
      payload: {},
    });
    dispatch({
      type: 'rolePermission/clear',
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
      type: 'rolePermission/saveSelectedRows',
      payload: selectedRows,
    });
  };

  setFormValues = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolePermission/setFormValues',
      payload: values,
    });
  };

  setUpdateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolePermission/setUpdateModalVisible',
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
        type: 'rolePermission/fetch',
        payload: values,
      });
    });
  };

  onTreeExpand = expandedKeys => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rolePermissionTree/expandedKeys',
      payload: expandedKeys,
    });
    dispatch({
      type: 'rolePermissionTree/autoExpandParent',
      payload: false,
    });
  };

  onTreeChecked = (checkedKeys, onChange) => {
    const { dispatch } = this.props;
    onChange(checkedKeys);
    dispatch({
      type: 'rolePermissionTree/checkedKeys',
      payload: checkedKeys,
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
      return { ...item, disabled: item.isSystem };
    });
    return { list: newList, pagination };
  };

  render() {
    const {
      rolePermission: { selectedRows, data, updateModalVisible, updateRole },
      rolePermissionTree: { expandedKeys, checkedKeys, autoExpandParent, treeData },
      loading,
      intl,
    } = this.props;
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
                <Button type={'dashed'} onClick={this.handleEditModalVisible(record)}>
                  {intl.formatMessage({ id: 'roleMgt.settingPermission' })}
                </Button>
              </span>
            );
          }
        },
      },
    ];

    const ModalProps = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.hideUpdateModal,
      updateModalVisible,
      updateRole,
      expandedKeys,
      checkedKeys,
      autoExpandParent,
      treeData,
      onTreeExpand: this.onTreeExpand,
      onTreeChecked: this.onTreeChecked,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        <RolePermissionCreateModal {...ModalProps} />
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(RoleList);
