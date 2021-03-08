import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Input, Row, Select, Modal } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './styles.less';
import AuthSettingModal from './AuthSettingModal';
import { filterNullFields } from '../../utils/utils';
import { injectIntl } from 'react-intl';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ authSetting, user, loading }) => ({
  authSetting,
  authorities: user.authorities,
  loading: loading.models.vendorSeries,
}))
@Form.create()
@injectIntl
export default class AuthSetting extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    this.handleSelectRows([]);
    dispatch({
      type: 'authSetting/fetch',
    });
  }

  onAddSubmit = data => {
    this.props.dispatch({
      type: 'authSetting/add',
      payload: data,
      callback: this.callBackRefresh,
    });
  };

  onUpdateSubmit = data => {
    this.props.dispatch({
      type: 'authSetting/patch',
      payload: data,
      callback: this.callBackRefresh,
    });
  };

  modalVisible = (flag, edit) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authSetting/setModal',
      payload: {
        modalVisible: flag,
        isEdit: edit,
      },
    });
  };

  updateModal = (record, isUpdate) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authSetting/setRecord',
      payload: record,
    });
    dispatch({
      type: 'authSetting/setModal',
      payload: {
        modalVisible: true,
        isEdit: true,
      },
    });
    dispatch({
      type: 'authSetting/setUpdateSign',
      payload: isUpdate,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'authSetting/setFormValues',
        payload: values,
      });

      dispatch({
        type: 'authSetting/fetch',
        payload: values,
      });
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'authSetting/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'authSetting/fetch',
      payload: {},
    });
  };
  handleRemove = e => {
    e.preventDefault();
    const { dispatch, authSetting: { selectedRows } } = this.props;
    const callback = this.callBackRefresh;
    confirm({
      title: '确定删除选中记录?',
      content: '',
      onOk() {
        if (!selectedRows) return;

        dispatch({
          type: 'authSetting/remove',
          payload: selectedRows.map(row => row.id).join(','),
          callback: callback,
        });
      },
    });
  };

  handleSelectRows = rows => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authSetting/setSelectedRows',
      payload: rows,
    });
  };

  //列表回调函数
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, authSetting: { formValues } } = this.props;

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
      type: 'authSetting/fetch',
      payload: params,
    });
  };

  //新增、删除之后回调此函数，刷新列表
  callBackRefresh = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'authSetting/setSelectedRows',
      payload: [],
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'authSetting/setFormValues',
        payload: values,
      });

      dispatch({
        type: 'authSetting/fetch',
        payload: values,
      });
    });
  };

  renderForm() {
    const { form: { getFieldDecorator }, intl } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label={intl.formatMessage({ id: 'authMgt.authName' })}>
              {getFieldDecorator('permissionName')(
                <Input placeholder={intl.formatMessage({ id: 'authMgt.authNameTip' })} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'authMgt.search' })}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.formatMessage({ id: 'authMgt.reset' })}
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
    const { authSetting: { selectedRows, data }, authorities, loading, intl } = this.props;
    const columns = [
      {
        title: intl.formatMessage({ id: 'authMgt.authName' }),
        dataIndex: 'permissionName',
        key: 'permissionName',
        align: 'center',
      },
      {
        title: intl.formatMessage({ id: 'authMgt.authDescription' }),
        dataIndex: 'permissionDesc',
        key: 'permissionDesc',
        align: 'center',
      },
      {
        title: intl.formatMessage({ id: 'authMgt.operation' }),
        key: 'operation',
        render: (operation, record) => {
          if (record.isSystem == 1) {
            return '系统权限禁止编辑';
          } else {
            return authorities.indexOf('am_authsetting_edit') > -1 ? (
              <Button type="dashed" onClick={() => this.updateModal(record, true)}>
                {intl.formatMessage({ id: 'authMgt.edit' })}
              </Button>
            ) : (
              <Button type="dashed" onClick={() => this.updateModal(record, false)}>
                {intl.formatMessage({ id: 'good.NotEdit' })}
              </Button>
            );
          }
        },
      },
    ];

    return (
      <PageHeaderLayout title={intl.formatMessage({ id: 'authMgt.authManagement' })}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {authorities.indexOf('am_authsetting_create') > -1 ? (
                <Button icon="plus" type="primary" onClick={() => this.modalVisible(true, false)}>
                  {intl.formatMessage({ id: 'authMgt.create' })}
                </Button>
              ) : null}
              {selectedRows.length > 0 &&
                (authorities.indexOf('am_authsetting_delete') > -1 ? (
                  <span>
                    <Button icon="minus" onClick={this.handleRemove}>
                      {intl.formatMessage({ id: 'authMgt.delete' })}
                    </Button>
                  </span>
                ) : null)}
            </div>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={this.processData(data)}
            columns={columns}
            rowKey={record => record.id}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <AuthSettingModal onUpdateSubmit={this.onUpdateSubmit} onAddSubmit={this.onAddSubmit} />
      </PageHeaderLayout>
    );
  }
}
