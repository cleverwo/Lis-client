import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Row, Divider, Modal } from 'antd';
import styles from '../../../common/common.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import WaterPriceModal from './WaterPriceModal';
import PriceStaircaseModal from './PriceStaircaseModal';
import ViewWaterPriceModal from './ViewWaterPriceModal';
import EditWaterPriceModal from './EditWaterPriceModal';
import StandardTable from '../../../components/StandardTable';
import { connect } from 'dva';
import { filterNullFields } from '../../../utils/utils';

const FormItem = Form.Item;

@connect(({ waterPrice, company, user }) => ({
  waterPrice,
  company,
  authorities: user.authorities,
}))
@Form.create()
export default class WaterPrice extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetch',
    });
    // dispatch({
    //   type: 'company/getHallSimpleList',
    // });
  }

  // 搜索框事件
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
        type: 'waterPrice/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'waterPrice/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'waterPrice/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'waterPrice/fetch',
    });
    dispatch({
      type: 'waterPrice/setSelectRows',
      payload: [],
    });
  };

  // 添加水价类型model显示
  handleAddPriceTypeVisible = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setModalVisible',
      payload: data,
    });
  };

  // 阶梯水价modal显示
  handleStaircaseVisible = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setStaircaseModalVisible',
      payload: data,
    });
  };

  // 水价详情modal显示
  handleViewModalVisible = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setViewModalVisible',
      payload: visible,
    });
  };

  // 修改水价显示
  handleEditPriceVisible = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setEditPriceVisible',
      payload: visible,
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
        type: 'waterPrice/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'waterPrice/fetch',
        payload: values,
      });
      dispatch({
        type: 'waterPrice/setSelectRows',
        payload: [],
      });
    });
  };

  // 查看水价
  handleViewPrice = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetchDetail',
      payload: record.id,
    });
    this.handleViewModalVisible(true);
  };

  // 选择水价事件
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'waterPrice/setSelectRows',
      payload: rows,
    });
  };

  // 删除水价事件
  handleDelete = rows => {
    const { dispatch } = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除水价信息？',
      content: '',
      onOk() {
        dispatch({
          type: 'waterPrice/deletePrice',
          payload: rows,
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, waterPrice: { formValues } } = this.props;

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
      type: 'waterPrice/fetch',
      payload: params,
    });
  };

  // 校验水价名称
  validPriceName = (value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/validPriceName',
      payload: value,
      callback: callback,
    });
  };

  // 添加水价
  handleAddPrice = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/addWaterPrice',
      payload: record,
      callback: this.handleAddPriceCallback,
    });
  };

  // 添加水价回调
  handleAddPriceCallback = () => {
    this.handleAddPriceTypeVisible(false);
    this.callBackRefresh();
  };

  // 点击修改水价
  handleClickEdit = (record, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetchDetail',
      payload: record.id,
    });
    this.handleEditPriceVisible(visible);
  };

  // 修改水价事件
  handleEditPrice = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/updateWaterPrice',
      payload: record,
      callback: this.handleEditPriceCallback,
    });
  };

  // 修改水价回调
  handleEditPriceCallback = () => {
    this.handleCloseEditModal(false);
    this.callBackRefresh();
  };

  // 关闭修改水价modal
  handleCloseEditModal = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setPriceDetail',
      payload: {},
    });
    this.handleEditPriceVisible(visible);
  };

  // 点击阶梯水价
  handleClickStaircase = (record, visible) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/fetchDetail',
      payload: record.id,
    });
    this.handleStaircaseVisible(visible);
  };

  // 修改阶梯水价
  handleEditStaircase = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/updateStaircasePrice',
      payload: record,
      callback: this.handleEditStaircaseCallback,
    });
  };

  // 修改阶梯水价回调
  handleEditStaircaseCallback = () => {
    this.handleCloseStaircaseModal(false);
    this.callBackRefresh();
  };

  // 关闭阶梯水价modal
  handleCloseStaircaseModal = visible => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterPrice/setPriceDetail',
      payload: {},
    });
    this.handleStaircaseVisible(visible);
  };

  // 返回搜索框信息
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { company: { businessHallList } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={16}>
            <FormItem label={'价格类别 '}>
              {getFieldDecorator('priceName')(
                <Input style={{ width: 150 }} placeholder="输入价格类别名称" />
              )}
            </FormItem>
          </Col>
          {/*<Col md={6} sm={16}>
            <FormItem label={'所属营业厅'}>
              {getFieldDecorator('hallId')(
                <Select style={{ width: 130 }}>
                  {businessHallList.map(item => (
                    <Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>*/}
          <Col md={6} sm={16}>
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
      waterPrice: {
        data,
        modalVisible,
        staircaseModalVisible,
        viewModalVisible,
        selectedRows,
        editPriceVisible,
      },
      authorities,
    } = this.props;

    const isEdit = authorities.indexOf('am_waterPrice_edit') > -1;
    const isCreate = authorities.indexOf('am_waterPrice_create') > -1;
    const isDelete = authorities.indexOf('am_waterPrice_delete') > -1;

    const columns = [
      // {
      //   title: '序号',
      //   dataIndex: 'id',
      //   key: 'id',
      // },
      // {
      //   title: '营业厅',
      //   dataIndex: 'hallName',
      //   key: 'hallName',
      // },
      {
        title: '用水性质',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '基础水价',
        dataIndex: 'basePrice',
        key: 'basePrice',
        render: (text, record) => {
          if (undefined === text) {
            return '无';
          }
          return text + '元';
        },
      },
      {
        title: '阶梯数量',
        dataIndex: 'staircaseNum',
        key: 'staircaseNum',
        render: (text, record) => {
          if (0 === text) {
            return '无阶梯价格';
          }
          return text + '个阶梯';
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 300,
        render: (text, record) => (
          <span>
            <a type="dashed" onClick={() => this.handleViewPrice(record, true)}>
              查看
            </a>

            <Divider type="vertical" dashed={!isEdit} />
            {isEdit ? (
              <a type="dashed" onClick={() => this.handleClickEdit(record, true)}>
                修改水价信息
              </a>
            ) : (
              ''
            )}
            <Divider type="vertical" dashed={!isEdit} />
            {isEdit ? (
              <a type="dashed" onClick={() => this.handleClickStaircase(record, true)}>
                修改阶梯水价
              </a>
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="水价管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ? (
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleAddPriceTypeVisible(true)}
                >
                  添加价格类别
                </Button>
              ) : (
                ''
              )}
              {selectedRows.length > 0 &&
                isDelete && (
                  <span>
                    <Button
                      icon="minus"
                      type="danger"
                      onClick={() => this.handleDelete(selectedRows)}
                    >
                      删除水价
                    </Button>
                  </span>
                )}
            </div>

            <Divider style={{ marginBottom: 32 }} />

            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey={record => record.id}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

        <WaterPriceModal
          modalVisible={modalVisible}
          handleModalVisible={this.handleAddPriceTypeVisible}
          onSubmit={this.handleAddPrice}
          handleValid={this.validPriceName}
        />

        <PriceStaircaseModal
          modalVisible={staircaseModalVisible}
          handleModalVisible={this.handleCloseStaircaseModal}
          onSubmit={this.handleEditStaircase}
        />

        <ViewWaterPriceModal
          modalVisible={viewModalVisible}
          handleModalVisible={this.handleViewModalVisible}
        />
        <EditWaterPriceModal
          modalVisible={editPriceVisible}
          handleModalVisible={this.handleCloseEditModal}
          onSubmit={this.handleEditPrice}
        />
      </PageHeaderLayout>
    );
  }
}
