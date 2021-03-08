import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Row, Divider, Modal } from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddBranchCompanyModal from './AddBranchCompanyModal';
import EditBranchCompanyModal from './EditBranchCompanyModal';
import ViewCompanyModal from './ViewCompanyModal';
import { connect } from 'dva';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const FormItem = Form.Item;

@connect(({ company, user }) => ({
  company,
  authorities: user.authorities,
}))
@Form.create()
export default class BranchCompany extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetchBranchCo',
    });
  }

  // 搜索框搜索事件
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
        type: 'company/setBranchCoFormValues',
        payload: values,
      });
      dispatch({
        type: 'company/fetchBranchCo',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'company/setBranchCoFormValues',
      payload: {},
    });
    dispatch({
      type: 'company/fetchBranchCo',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, company: { branchCoFormValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...branchCoFormValues,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetchBranchCo',
      payload: params,
    });
  };

  // 添加子公司modal显示
  handleAddBranchCoVisible = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/setAddBranchCoVisible',
      payload: data,
    });
  };

  // 修改子公司modal显示
  handleEditBranchCoVisible = (record, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/setEditBranchCoVisible',
      payload: data,
    });
    dispatch({
      type: 'company/saveRecord',
      payload: record,
    });
  };

  // 查看公司信息modal显示
  handleViewCompanyVisible = (record, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/setViewCompanyVisible',
      payload: visible,
    });
    dispatch({
      type: 'company/saveRecord',
      payload: record,
    });
  };

  // 回调 刷新列表
  callBackRefresh = () => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'company/setBranchCoFormValues',
        payload: values,
      });
      dispatch({
        type: 'company/fetchBranchCo',
        payload: values,
      });
    });
  };

  // 删除触发事件
  handleRemove = coId => {
    const { dispatch } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除公司信息?',
      content: '',
      onOk() {
        dispatch({
          type: 'company/remove',
          payload: coId,
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  // 处理添加子公司
  handleAddBranchCo = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/addBranchCo',
      payload: record,
      callback: this.handleAddBranchCallback,
    });
  };

  // 添加子公司回调
  handleAddBranchCallback = () => {
    this.handleAddBranchCoVisible(false);
    this.callBackRefresh();
  };

  // 修改公司信息
  handleEditBranchCo = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/updateBranchCo',
      payload: record,
      callback: this.handleEditBranchCallback,
    });
  };

  // 修改子公司回调
  handleEditBranchCallback = () => {
    this.handleEditBranchCoVisible({}, false);
    this.callBackRefresh();
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={48}>
            <FormItem label="公司名称">
              {getFieldDecorator('coName')(<Input placeholder="输入公司名称" />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      company: {
        branchCoData,
        addBranchCoVisible,
        viewCompanyVisible,
        editBranchCoVisible,
      },
      authorities,
    } = this.props;

    const isEdit = authorities.indexOf('am_companyChildren_edit') > -1;
    const isDelete = authorities.indexOf('am_companyChildren_delete') > -1;
    const isCreate = authorities.indexOf('am_companyChildren_create') > -1;

    const columns = [
      {
        title: '序号',
        dataIndex: 'coId',
        key: 'coId',
      },
      {
        title: '公司名称',
        dataIndex: 'coName',
        key: 'coName',
      },
      {
        title: '所在省市区',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.handleViewCompanyVisible(record, true)}>
              查看
            </a>
            <Divider type="vertical" dashed={!isEdit} />
            {isEdit ? (
              <a type="dashed" onClick={() => this.handleEditBranchCoVisible(record, true)}>
                修改
              </a>
            ) : (
              ''
            )}
            <Divider type="vertical" dashed={!isDelete} />
            {isDelete ? (
              <a type="dashed" onClick={() => this.handleRemove(record.coId)}>
                删除
              </a>
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="子公司管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleAddBranchCoVisible(true)}
                >
                  添加子公司
                </Button>
              ) : (
                ''
              )}
            </div>

            <Divider style={{ marginBottom: 32 }} />

            <StandardTable
              selectedRows={[]}
              loading={loading}
              data={branchCoData}
              columns={columns}
              rowKey={record => record.coId}
              onChange={this.handleStandardTableChange}
              noSelect={ true }
            />
          </div>
        </Card>

        <AddBranchCompanyModal
          modalVisible={addBranchCoVisible}
          handleModalVisible={this.handleAddBranchCoVisible}
          onSubmit={this.handleAddBranchCo}
        />
        <ViewCompanyModal
          modalVisible={viewCompanyVisible}
          handleModalVisible={this.handleViewCompanyVisible}
        />
        <EditBranchCompanyModal
          modalVisible={editBranchCoVisible}
          handleModalVisible={this.handleEditBranchCoVisible}
          onSubmit={this.handleEditBranchCo}
        />
      </PageHeaderLayout>
    );
  }
}
