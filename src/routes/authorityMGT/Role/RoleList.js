import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../../../common/common.less';
import RoleCreateModal from './RoleCreateModal';
import RoleUpdateModal from './RoleUpdateModal';
import RoleUserModal from './RoleUserModal';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const transform = {
  0: '总公司',
  1: '分公司',
  2: '服务大厅',
};

@connect(({ loading, role, user }) => ({
  role,
  authorities: user.authorities,
  loading: loading.models.role,
}))
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
      console.log('搜索的条件', values);
      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  /*重置按钮*/
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setFormValues({});
    dispatch({
      type: 'role/fetch',
    });
  };

  /*点击删除*/
  handleMenuClick = e => {
    e.preventDefault();
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

  /*点击编辑*/
  handleEditModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    return () => {
      dispatch({
        type: 'role/saveUpdateRole',
        payload: record,
      });
      this.setUpdateModalVisible(flag);
    };
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

  // 关闭编辑窗口
  hideUpdateModal = () => {
    const { dispatch } = this.props;
    this.setUpdateModalVisible(false);
    dispatch({
      type: 'role/saveUpdateRole',
      payload: {},
    });
  };

  /* 点击设置角色成员 */
  handleChangeMember = (flag, record) => {
    const { dispatch } = this.props;
    const that = this;
    return () => {
      dispatch({
        type: 'role/saveUpdateRole',
        payload: record,
      });
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
          that.setChangeMemberModalVisible(flag);
        },
      });
    };
  };

  /*设置人员提交*/
  handleChange = (fields, form) => {
    this.props.dispatch({
      type: 'role/changeUpdate',
      payload: fields,
      callback: success => {
        this.callBackRefresh();
        this.setChangeMemberModalVisible(!success);
        this.resetFormAfterDispatch(form, success);
      },
    });
  };

  // 关闭设置人员窗口
  hideChangeMemberModal = () => {
    const { dispatch } = this.props;
    this.setChangeMemberModalVisible(false);
    dispatch({
      type: 'userTransfer/targetKeys',
      payload: [],
    });
  };

  resetFormAfterDispatch(form, reset) {
    if (reset) {
      form.resetFields();
    }
  }

  handleSelectRows = rows => {
    this.setSelectedRows(rows);
  };

  //设置选中行
  setSelectedRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/saveSelectedRows',
      payload: rows,
    });
  };

  setFormValues = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setFormValues',
      payload: values,
    });
  };

  //修改显示modal的值
  setCreateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setCreateModalVisible',
      payload: flag,
    });
  };

  //修改显示更新modal的值
  setUpdateModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setUpdateModalVisible',
      payload: flag,
    });
  };

  //修改设置人员modal的值
  setChangeMemberModalVisible = flag => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/setChangeModalVisible',
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('roleName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
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
    const {
      role: { data, selectedRows, createModalVisible, updateModalVisible, changeModalVisible },
      loading,
      authorities,
    } = this.props;

    const isEdit = authorities.indexOf('am_securityRole_edit') > -1;
    const isOperate = authorities.indexOf('am_securityRole_setMember') > -1;
    const isCreate = authorities.indexOf('am_securityRole_create') > -1;
    const isDelete = authorities.indexOf('am_securityRole_delete') > -1;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        align: 'center',
      },
      {
        title: '角色描述',
        dataIndex: 'roleDesc',
        align: 'center',
      },
      {
        title: '所属公司',
        dataIndex: 'coLevel',
        align: 'center',
        render: record => transform[record],
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          if (record.isSystem) {
            return '系统数据禁止操作';
          } else {
            return (
              <span>
                {isEdit ? <a onClick={this.handleEditModalVisible(true, record)}>编辑</a> : ''}
                <Divider type="vertical" dashed={!isEdit} />
                {isOperate ? (
                  <a onClick={this.handleChangeMember(true, record)}>设置人员</a>
                ) : ""}
              </span>
            );
          }
        },
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建角色
                </Button>
              ) : (
                ''
              )}
              {selectedRows.length > 0 &&
                isDelete && (
                  <span>
                    <Button style={{ marginLeft: 5 }} icon="minus" onClick={this.handleMenuClick}>
                      删除
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
        <RoleCreateModal
          modalVisible={createModalVisible}
          handleModalVisible={this.handleModalVisible}
          handleValid={this.validRoleName}
          onSubmit={this.handleAdd}
        />
        <RoleUpdateModal
          modalVisible={updateModalVisible}
          handleModalVisible={this.hideUpdateModal}
          handleValid={this.validRoleName}
          onSubmit={this.handleUpdate}
        />
        <RoleUserModal
          modalVisible={changeModalVisible}
          handleModalVisible={this.hideChangeMemberModal}
          onSubmit={this.handleChange}
          isEdit={isOperate}
        />
      </PageHeaderLayout>
    );
  }
}

export default Form.create()(RoleList);
