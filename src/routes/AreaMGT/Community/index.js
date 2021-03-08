import React, {Component} from "react";
import moment from "moment";
import {Button, Card, Col, Divider, Form, Input, Modal, Row} from "antd";
import StandardTable from "../../../components/StandardTable";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {connect} from 'dva';
import {filterNullFields} from "../../../utils/utils";
import AddressCascader from "../../Components/AddressCascader";
import AddModal from "./AddModal";
import styles from "../../../common/common.less";
import EditModal from "./EditModal";
import ChildrenModal from "./ChildrenModal";

const FormItem = Form.Item;


@connect(({community, user, loading}) => ({
  community,
  loading: loading.effects['community/fetch'],
  authorities: user.authorities,
}))
@Form.create()
export default class Community extends Component {

  state = {
    selectedRows: [],
    formValues: {},
    modalVisible: false,
    editModalVisible: false,
    childrenModalVisible: false,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'community/fetch',
    });
  }

  //显示编辑框
  showUpdateModal = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'community/saveRecord',
      payload: record,
    });
    this.changeEditModalVisible(true);
  };

  //显示孩子框
  showChildrenModal = (record) =>{
    console.log("record",record)
    this.props.dispatch({
      type: 'community/setRecordId',
      payload: {
        communityId: record.id,
        areaCode: record.areaCode,
      },
    });
    this.props.dispatch({
      type: 'community/fetchBlockList',
      payload: record.id,
      callback: () => this.changeChildrenModalVisible(true)
    });
  };

  //删除区域
  handleRemove = e => {
    e.preventDefault();
    const {dispatch} = this.props;
    const {selectedRows} = this.state;
    const callback = () =>{
      this.setState({
        selectedRows: [],
      });
      this.callBackRefresh();
    };
    Modal.confirm({
      title: '确定删除选中区域信息?',
      content: '',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'community/remove',
          payload: selectedRows.map(row => row.id).join(','),
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });

  };

  //新增区域
  handleAdd = data => {
    this.changeModalVisible(data);
  };

  //新增提交
  handleAddSubmit = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'community/add',
      payload: record,
      callback: this.callBackRefresh,
    });
  };

  //修改提交
  handleEdit = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'community/update',
      payload: record,
      callback: this.callBackRefresh,
    });
  };

  //修改新增窗口状态
  changeModalVisible = data => {
    this.setState({
      modalVisible: data,
    })
  };

  //修改编辑窗口状态
  changeEditModalVisible = data =>{
    this.setState({
      editModalVisible: data,
    })
  };

  //修改孩子窗口状态
  changeChildrenModalVisible = data =>{
    this.setState({
      childrenModalVisible: data,
    })
  };

  //查询重置
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'community/fetch',
      payload: {},
    });
  };

  //查询提交
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        areaCode: (fieldsValue.addressCode && fieldsValue.addressCode.length > 2) ? fieldsValue.addressCode[2] : undefined,
        cityCode: (fieldsValue.addressCode && fieldsValue.addressCode.length > 1) ? fieldsValue.addressCode[1] : undefined,
        provinceCode: (fieldsValue.addressCode && fieldsValue.addressCode.length > 0) ? fieldsValue.addressCode[0] : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'community/fetch',
        payload: values,
      });
    });
  };

  //选择区域
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch,} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
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
      type: 'community/fetch',
      payload: params,
    });
  };

  //回调 刷新列表
  callBackRefresh = () => {
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'community/fetch',
        payload: values,
      });
    });
  };

  //搜索框
  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="小区名称">
              {getFieldDecorator('name')(<Input placeholder="请输入..."/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="详细地址">
              {getFieldDecorator('addressCode')(
                <AddressCascader/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span style={{float: 'left', marginBottom: 24}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const {loading, community: {data,isUpdate},authorities} = this.props;
    const {selectedRows} = this.state;

    const isCreate = authorities.indexOf('am_area_create') > -1;
    const isDelete = authorities.indexOf('am_area_delete') > -1;
    const isEdit = authorities.indexOf('am_area_edit') > -1;

    const columns = [
      {
        title: '区域名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm:ss')}</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.showChildrenModal(record)}>
              楼栋
            </a>
            <Divider type="vertical" dashed={!isEdit}/>
            {isEdit ? (
              <a type="dashed" onClick={() => this.showUpdateModal(record)}>
                编辑
              </a>
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="区域管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ?
                <Button icon="plus" type="primary" onClick={() => this.handleAdd(true)}>
                  新增区域
                </Button> : ""}
              {selectedRows.length > 0 &&
              isDelete && (
                <span>
                    <Button icon="minus" onClick={this.handleRemove}>
                      删除区域
                    </Button>
                  </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey={record => record.uid}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{x: 1200}}
            />
          </div>
        </Card>
        <AddModal
          modalVisible={this.state.modalVisible}
          handleModalVisible={this.changeModalVisible}
          onSubmit={this.handleAddSubmit}
        />
        <EditModal
          modalVisible={this.state.editModalVisible}
          handleModalVisible={this.changeEditModalVisible}
          onSubmit={this.handleEdit}
        />
        <ChildrenModal
          modalVisible={this.state.childrenModalVisible}
          handleModalVisible={this.changeChildrenModalVisible}
          isUpdate={isUpdate}
        />
      </PageHeaderLayout>
    )
  }

}
