import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Divider, Modal } from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import ViewCompanyModal from './ViewCompanyModal';
import AddHallModal from './AddHallModal';
import EditHallModal from './EditHallModal';
import { filterNullFields } from '../../utils/utils';
import StandardTable from '../../components/StandardTable';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ company, user }) => ({
  company,
  authorities: user.authorities,
}))
@Form.create()
export default class BusinessHall extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/getBranchCoSimpleList',
    });
    dispatch({
      type: 'company/fetchBusinessHall',
    });
  }

  // 查看大厅信息modal显示
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

  // 添加大厅信息modal显示
  handleAddHallVisible = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/setAddHallVisible',
      payload: data,
    });
  };

  // 修改大厅modal显示
  handleEditHallVisible = (record, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/saveRecord',
      payload: record,
    });
    dispatch({
      type: 'company/setEditHallVisible',
      payload: visible,
    });
  };

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
        type: 'company/setHallFormValues',
        payload: values,
      });
      dispatch({
        type: 'company/fetchBusinessHall',
        payload: values,
      });
    });
  };

  // 搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'company/setHallFormValues',
      payload: {},
    });
    dispatch({
      type: 'company/fetchBusinessHall',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, company: { hallFormValues } } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...hallFormValues,
      filter: JSON.stringify(filters),
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'company/fetchBusinessHall',
      payload: params,
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
        type: 'company/setHallFormValues',
        payload: values,
      });
      dispatch({
        type: 'company/fetchBusinessHall',
        payload: values,
      });
    });
  };

  // 删除触发事件
  handleRemove = coId => {
    const { dispatch } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除大厅信息?',
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

  // 处理添加大厅
  handleAddHall = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/addBusinessHall',
      payload: record,
      callback: this.handleAddHallCallback,
    });
  };

  // 添加大厅回调
  handleAddHallCallback = () => {
    this.handleAddHallVisible(false);
    this.callBackRefresh();
  };

  // 修改大厅
  handleEditHall = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/updateBusinessHall',
      payload: record,
      callback: this.handleEditHallCallBack,
    });
  };

  // 修改大厅回调
  handleEditHallCallBack = () => {
    this.handleEditHallVisible({}, false);
    this.callBackRefresh();
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { company: { branchCoList } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={48}>
            <FormItem label="大厅名称">
              {getFieldDecorator('hallName')(<Input placeholder="输入服务大厅名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={16}>
            <FormItem label={'所属子公司'}>
              {getFieldDecorator('branchCoId')(
                <Select style={{ width: 130 }}>
                  {branchCoList.map(item => (
                    <Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Option>
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
        businessHallData,
        viewCompanyVisible,
        addHallVisible,
        editHallVisible,
      },
      authorities,
    } = this.props;

    const isEdit = authorities.indexOf('am_companyHall_edit') > -1;
    const isCreate = authorities.indexOf('am_companyHall_create') > -1;
    const isDelete = authorities.indexOf('am_companyHall_delete') > -1;

    const columns = [
      {
        title: '序号',
        dataIndex: 'coId',
        key: 'coId',
      },
      {
        title: '大厅名称',
        dataIndex: 'coName',
        key: 'coName',
      },
      {
        title: '所属子公司',
        dataIndex: 'superiorCo',
        key: 'superiorCo',
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
              <a type="dashed" onClick={() => this.handleEditHallVisible(record, true)}>
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
      <PageHeaderLayout title="服务大厅管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button icon="plus" type="primary" onClick={() => this.handleAddHallVisible(true)}>
                  添加服务大厅
                </Button>
              ) : (
                ''
              )}
            </div>

            <Divider style={{ marginBottom: 32 }} />

            <StandardTable
              selectedRows={[]}
              loading={loading}
              data={businessHallData}
              columns={columns}
              rowKey={record => record.coId}
              onChange={this.handleStandardTableChange}
              noSelect={ true }
            />
          </div>
        </Card>
        <ViewCompanyModal
          modalVisible={viewCompanyVisible}
          handleModalVisible={this.handleViewCompanyVisible}
        />
        <AddHallModal
          modalVisible={addHallVisible}
          handleModalVisible={this.handleAddHallVisible}
          onSubmit={this.handleAddHall}
        />
        <EditHallModal
          modalVisible={editHallVisible}
          handleModalVisible={this.handleEditHallVisible}
          onSubmit={this.handleEditHall}
        />
      </PageHeaderLayout>
    );
  }
}
