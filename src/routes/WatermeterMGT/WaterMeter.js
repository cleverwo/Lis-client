import React, {Component} from 'react';
import {Button, Card, Col, Form, Input, Row, Select, Divider, Icon, Modal, Switch, Dropdown, Menu,} from 'antd';
import styles from '../../common/common.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import {connect} from 'dva';
import {filterNullFields} from '../../utils/utils';
import WaterMeterModal from './WaterMeterModal';
import WaterMeterViewModal from './WaterMeterViewModal';
import WaterMeterRequestModal from './WaterMeterRequestModal';
import AddWaterMeterModal from './AddWaterMeterModal';
import BatchAddMeterModal from './BatchAddMeterModal';
import moment from "moment";
import FiveAddressCascader from "../Components/FiveAddressCascader";
import BatchSetTimeModal from "./BatchSetTimeModal";
import NotSetTimeModal from "./NotSetTimeModal";
import UploadImeiModal from "./UploadImeiModal";

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({waterMeter, company, user,loading}) => ({
  waterMeter,
  company,
  authorities: user.authorities,
  loading: loading.effects['waterMeter/fetch'],
}))
@Form.create()
export default class WaterMeter extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/fetch',
    });
    dispatch({
      type: 'company/getHallSimpleList',
    });
  }

  //修改用户确定按钮
  handleEdit = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/update',
      payload: record,
      callback: this.handleEditCallback,
    });
  };
  //修改用户回调
  handleEditCallback = () => {
    this.callBackRefresh();
    this.handleModalVisible();
  };

  //查看
  showViewModal = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/setViewModalVisible',
      payload: true,
    });
    dispatch({
      type: 'waterMeter/saveRecord',
      payload: record,
    });
    dispatch({
      type: 'waterMeter/getOperateList',
      payload: {
        meterId: record.id,
      },
    });
    dispatch({
      type: 'waterMeter/getRequestList',
      payload: {
        meterId: record.id,
      },
    });
  };

  //新增水表
  handleAddMeter = data => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/setAddModalVisible',
      payload: data,
    });
  };

  handleAddSubmit = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/add',
      payload: record,
      callback: this.handleEditCallback,
    });
  };

  //删除触发事件
  handleRemove = e => {
    e.preventDefault();
    const {dispatch, waterMeter: {selectedRows}} = this.props;
    const callback = this.callBackRefresh;
    Modal.confirm({
      title: '确定删除选中水表信息?',
      content: '',
      onOk() {
        if (!selectedRows) return;
        dispatch({
          type: 'waterMeter/remove',
          payload: selectedRows.map(row => row.id).join(','),
          callback: callback,
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  // 修改开关闸状态
  changeStatus = (checked, record) => {
    const {dispatch} = this.props;
    const callBackRefresh = this.callBackRefresh;
    Modal.confirm({
      title: checked ? '是否开闸' : '是否关闸',
      onOk() {
        dispatch({
          type: 'waterMeter/changeStatus',
          payload: {
            flag: !checked,
            id: record.id,
            meterCode: record.meterCode,
          },
          callback: () => {
            callBackRefresh();
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  //显示编辑框
  showUpdateModal = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/setModalVisible',
      payload: true,
    });
    dispatch({
      type: 'waterMeter/saveRecord',
      payload: record,
    });
  };

  //取消显示编辑框
  handleModalVisible = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/setModalVisible',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/setViewModalVisible',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/saveRecord',
      payload: {},
    });
  };

  // 批量添加水表
  handleUploadModal = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setUploadModalVisible',
      payload: data,
    });
  };

  // 批量添加水表提交事件
  handleBatchAddSubmit = record => {
    const { dispatch, waterMeter: { fileList } } = this.props;
    const formData = new FormData();
    formData.append('waterMeterAddress', record.waterMeterAddress);
    formData.append('waterPriceId', record.waterPriceId);
    formData.append('description', record.description);
    formData.append('productId', record.productId);
    formData.append('meterPlatform', record.meterPlatform);
    formData.append('file', fileList[0]);
    dispatch({
      type: 'waterMeter/batchAddMeter',
      payload: formData,
      callback: this.handleBatchAddCallback,
    });
  };

  // 批量添加成功后回调
  handleBatchAddCallback = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMete/setUploading',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/setFileList',
      payload: [],
    });
    this.callBackRefresh();
    this.handleUploadModal(false);
  };

  // 批量下发上报时间
  handleSetTimeModal = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setSetTimeModalVisible',
      payload: data,
    });
  };

  // 批量下发上报时间提交事件
  handleBatchTimeSubmit = record => {
    const { dispatch, waterMeter: { fileList } } = this.props;
    const formData = new FormData();
    formData.append('startHour', record.startTime.format('h'));
    formData.append('startMinute', record.startTime.format('m'));
    formData.append('interval', record.interval);
    formData.append('file', fileList[0]);
    dispatch({
      type: 'waterMeter/batchSetReportTime',
      payload: formData,
      callback: this.handleBatchSetTimeCallback,
    });
  };

  // 批量下发上报时间成功后回调
  handleBatchSetTimeCallback = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setUploading',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/setFileList',
      payload: [],
    });
    this.handleSetTimeModal(false);
  };

  // 查看设置时间结果modal
  handleNotSetTimeModal = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setNotSetTimeModalVisible',
      payload: data,
    });
  };

  // 上传IMEI文件modal
  handleUploadImeiModal = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setUploadImeiModalVisible',
      payload: data,
    });
  };

  // 上传IMEI文件
  handleUploadImeiSubmit = () => {
    const { dispatch, waterMeter: { fileList } } = this.props;
    const formData = new FormData();
    formData.append('file', fileList[0]);
    dispatch({
      type: 'waterMeter/uploadImeiList',
      payload: formData,
      callback: this.handleUploadImeiCallback,
    });
  };

  // 上传IMEI文件回调
  handleUploadImeiCallback = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterMeter/setUploading',
      payload: false,
    });
    dispatch({
      type: 'waterMeter/setFileList',
      payload: [],
    });
    this.handleUploadImeiModal(false);
  };

  //搜索框搜索事件
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      filterNullFields(fieldsValue);
      /*过滤掉空字符串参数*/
      const values = {
        ...fieldsValue,
        provinceCode: (fieldsValue.address && fieldsValue.address.length > 0) ? fieldsValue.address[0] : undefined,
        cityCode: (fieldsValue.address && fieldsValue.address.length > 1) ? fieldsValue.address[1] : undefined,
        areaCode: (fieldsValue.address && fieldsValue.address.length > 2) ? fieldsValue.address[2] : undefined,
        communityCode: (fieldsValue.address && fieldsValue.address.length > 3) ? fieldsValue.address[3] : undefined,
        blockCode: (fieldsValue.address && fieldsValue.address.length > 4) ? fieldsValue.address[4] : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'waterMeter/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'waterMeter/fetch',
        payload: values,
      });
    });
  };

  //搜索框重置事件
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'waterMeter/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'waterMeter/fetch',
    });
  };

  //选择水表事件
  handleSelectRows = rows => {
    this.props.dispatch({
      type: 'waterMeter/setSelectRows',
      payload: rows,
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch, waterMeter: {formValues}} = this.props;

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
      type: 'waterMeter/fetch',
      payload: params,
    });
  };

  //回调 刷新列表
  callBackRefresh = () => {
    const {dispatch, form} = this.props;
    dispatch({
      type: 'waterMeter/setSelectRows',
      payload: [],
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'waterMeter/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'waterMeter/fetch',
        payload: values,
      });
    });
  };

  //设置查询条件是否展开
  saveExpandSearchForm = data => {
    this.props.dispatch({
      type: 'waterMeter/setExpandSearchForm',
      payload: data,
    });
  };

  //返回搜索框信息
  renderForm() {
    return this.props.waterMeter.expandSearchForm
      ? this.renderAdvanceForm()
      : this.renderSimpleForm();
  }

  //未展开搜索框
  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 32, xl: 48}}>
          <Col md={8} sm={32}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入用户水表账号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={32}>
            <Form.Item label="地址">
              {getFieldDecorator('address')(
                <FiveAddressCascader/>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={32}>
            <span style={{float: 'left', marginBottom: 24}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={() => this.saveExpandSearchForm(true)}>
                展开
                <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  // 展开搜索框
  renderAdvanceForm() {
    const {getFieldDecorator} = this.props.form;
    const {company: {businessHallList}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 32, xl: 48}}>
          <Col md={8} sm={32}>
            <FormItem label="水表账号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入用户水表账号"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={32}>
            <Form.Item label="地址">
              {getFieldDecorator('address')(
                <FiveAddressCascader/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={8} sm={32}>
            <FormItem label="所属营业厅">
              {getFieldDecorator('hallId')(
                <Select placeholder="输入选择">
                  {businessHallList.map(item => (
                    <Select.Option key={item.comId} value={item.comId}>
                      {item.comName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={32}>
            <span style={{float: 'left', marginBottom: 24}}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{marginLeft: 8}} onClick={() => this.saveExpandSearchForm(false)}>
                收起
                <Icon type="up"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  /*显示请求数据modal*/
  handleRequestVisible = data => {
    const {dispatch} = this.props;
    dispatch({
      type: 'waterMeter/setRequestModalVisible',
      payload: data,
    });
  };

  /*获取计量数据 */
  handleRequestCalData = record => {
    const {dispatch} = this.props;
    Modal.confirm({
      title: '确定获取计量数据数据?',
      content: '',
      onOk() {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: record.id,
            operType: '01',
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /*获取水表阶梯水价*/
  handleRequestPrice = record => {
    const {dispatch} = this.props;
    Modal.confirm({
      title: '确定获取水表阶梯水价数据?',
      content: '',
      onOk() {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: record.id,
            operType: '02',
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /*获取结算日*/
  handleRequestSetDate = record => {
    const {dispatch} = this.props;
    Modal.confirm({
      title: '确定获取结算日数据?',
      content: '',
      onOk() {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: record.id,
            operType: '03',
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  handleRequestSubmissionTime = record =>{
    const {dispatch} = this.props;
    Modal.confirm({
      title: '确定获取上报日期?',
      content: '',
      onOk() {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: record.id,
            operType: '18',
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /*获取水价余额*/
  handleRequestRecAmount = record => {
    const {dispatch} = this.props;
    Modal.confirm({
      title: '确定获取水价余额数据?',
      content: '',
      onOk() {
        dispatch({
          type: 'waterMeter/setMeterRequest',
          payload: {
            meterId: record.id,
            operType: '04',
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /*获取历史数据*/
  handleRequestHisData = record => {
    this.handleRequestVisible(true);
    this.props.dispatch({
      type: 'waterMeter/setRequestHistoryRecord',
      payload: {
        id: record.id,
      },
    });
  };

  render() {
    const {
      loading,
      waterMeter: {
        selectedRows,
        data,
        modalVisible,
        viewModalVisible,
        requestModalVisible,
        addModalVisible,
        uploadModalVisible,
        setTimeModalVisible,
        notSetTimeModalVisible,
        uploadImeiModalVisible,
      },
      authorities,
    } = this.props;

    const isEdit = authorities.indexOf('am_waterMeter_edit') > -1;
    const isValve = authorities.indexOf('am_waterMeter_valve') > -1;
    const isMeterPrice = authorities.indexOf('am_waterMeter_meterPrice') > -1;
    const isOtherCommand = authorities.indexOf('am_waterMeter_other') > -1;
    const isRequestMeter = authorities.indexOf('am_waterMeter_request') > -1;
    const isCreate = authorities.indexOf('am_waterMeter_create') > -1;
    const isDelete = authorities.indexOf('am_waterMeter_delete') > -1;
    const isBatchCreate = authorities.indexOf('am_waterMeter_batch_create') > -1;
    const isBatchTime = authorities.indexOf('am_waterMeter_batch_time') > -1;

    const menu = record => (
      <Menu>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestCalData(record)}>
            获取计量数据
          </a>
        </Menu.Item>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestPrice(record)}>
            获取当前价格表
          </a>
        </Menu.Item>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestSetDate(record)}>
            获取结算日
          </a>
        </Menu.Item>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestSubmissionTime(record)}>
            获取上报时间
          </a>
        </Menu.Item>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestRecAmount(record)}>
            获取水价余额
          </a>
        </Menu.Item>
        <Menu.Item>
          <a type="dashed" onClick={() => this.handleRequestHisData(record)}>
            获取历史记录
          </a>
        </Menu.Item>
      </Menu>
    );

    const columns = [
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '用水性质',
        dataIndex: 'waterPrice',
        key: 'waterPrice',
        render: val => (val ? val : '无计费标准'),
      },
      {
        title: '所属平台',
        dataIndex: 'deviceId',
        key: 'deviceId',
        render: val => (val ? '电信平台' : '本地平台'),
      },
      {
        title: '水费余额',
        dataIndex: 'waterBalance',
        key: 'waterBalance',
        render: val => `${val}元`,
      },
      {
        title: '所属用户',
        dataIndex: 'customerName',
        key: 'customerName',
        render: val => (val ? val : '无用户'),
      },
      {
        title: '上次通信时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
      },
      {
        title: '开关闸',
        dataIndex: 'meterState',
        key: 'meterState',
        render: (text, record) => (
          <span>
            {record.meterValve === 'Y' ?
              <Switch
                defaultChecked={record.meterState === 'OPEN'}
                checked={record.meterState === 'OPEN'}
                onChange={checked => {
                  this.changeStatus(checked, record);
                }}
                disabled={!isValve}
                checkedChildren="开闸"
                unCheckedChildren="关闸"
              />
              : "无阀门"}
          </span>
        ),
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
            <a type="dashed" onClick={() => this.showViewModal(record)}>
              查看
            </a>
            <Divider type="vertical" dashed={!isEdit}/>
            {isEdit ? (
              <a type="dashed" onClick={() => this.showUpdateModal(record)}>
                编辑
              </a>
            ) : (
              ''
            )}
            <Divider type="vertical" dashed={!isRequestMeter}/>
            {isRequestMeter ? (
              <Dropdown overlay={menu(record)}>
                <a>
                  其他
                  <Icon type="down"/>
                </a>
              </Dropdown>
            ) : ""}
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="水表管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {isCreate ?
                <Button icon="plus" type="primary" onClick={() => this.handleAddMeter(true)}>
                  新增水表
                </Button> : ""}
              {isBatchCreate ?
                <Button icon="plus" onClick={() => this.handleUploadModal(true)}>
                  批量添加
                </Button> : ""}
              {isBatchTime ?
                <Button icon="clock-circle" onClick={() => this.handleSetTimeModal(true)}>
                  批量下发上报时间
                </Button> : ""}
              {isBatchTime ?
                <Button icon="clock-circle" onClick={() => this.handleNotSetTimeModal(true)}>
                  查看下发时间结果
                </Button> : ""}
              {isBatchCreate ?
                <Button icon="cloud-upload" onClick={() => this.handleUploadImeiModal(true)}>
                  上传IMEI
                </Button> : ""}
              {selectedRows.length > 0 &&
              isDelete && (
                <span>
                    <Button icon="minus" onClick={this.handleRemove}>
                      删除水表
                    </Button>
                  </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowKey={record => record.id}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              scroll={{x: 1200}}
            />
          </div>
        </Card>
        <WaterMeterModal
          modalVisible={modalVisible}
          handleModalVisible={this.handleModalVisible}
          callBackRefresh={this.callBackRefresh}
          onSubmit={this.handleEdit}
          isValve={isValve}
          isMeterPrice={isMeterPrice}
          isOtherCommand={isOtherCommand}
        />
        <WaterMeterViewModal
          modalVisible={viewModalVisible}
          handleModalVisible={this.handleModalVisible}
        />
        <WaterMeterRequestModal
          modalVisible={requestModalVisible}
          handleModalVisible={this.handleRequestVisible}
        />
        <AddWaterMeterModal
          modalVisible={addModalVisible}
          handleModalVisible={() => this.handleAddMeter(false)}
          onSubmit={this.handleAddSubmit}
        />
        <BatchAddMeterModal
          modalVisible={uploadModalVisible}
          handleModalVisible={() => this.handleUploadModal(false)}
          onSubmit={this.handleBatchAddSubmit}
        />
        <BatchSetTimeModal
          modalVisible={setTimeModalVisible}
          handleModalVisible={() => this.handleSetTimeModal(false)}
          onSubmit={this.handleBatchTimeSubmit}
        />
        <NotSetTimeModal
          modalVisible={notSetTimeModalVisible}
          handleModalVisible={this.handleNotSetTimeModal}
        />
        <UploadImeiModal
          modalVisible={uploadImeiModalVisible}
          handleModalVisible={this.handleUploadImeiModal}
          onSubmit={this.handleUploadImeiSubmit}
        />
      </PageHeaderLayout>
    );
  }
}
