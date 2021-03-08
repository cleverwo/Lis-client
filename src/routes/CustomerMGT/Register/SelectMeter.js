import React, { PureComponent }from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../../../common/common.less';
import StandardTable from '../../Components/StandardTable';
import { filterNullFields } from '../../../utils/utils';
import FiveAddressCascader from "../../Components/FiveAddressCascader";

const ValveState = {
  OPEN: '开闸',
  DOWN: '关闸',
};

@connect(({ meter ,loading}) => ({
  meter,
  loading: loading.effects['meter/fetch'],
}))
@Form.create()
export default class SelectMeter extends PureComponent {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'meter/fetch',
    });
  }

  //上一步
  onPrev = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/customer/register/customerInfo'));
    dispatch({
      type: 'meter/setSelectRows',
      payload: [],
    });
  };

  //下一步
  onValidateForm = e => {
    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    e.preventDefault();
    validateFields((err) => {
      if (!err) {
        dispatch(routerRedux.push('/customer/register/meterInfo'));
      }
    });
  };

  //选择水表事件
  handleSelectRows = (rows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'meter/setSelectRows',
      payload: rows,
    });
    dispatch({
      type: 'meter/setRecord',
      payload: rows[0],
    });
  };

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
        provinceCode: (fieldsValue.address && fieldsValue.address.length > 0) ? fieldsValue.address[0] : undefined,
        cityCode: (fieldsValue.address && fieldsValue.address.length > 1) ? fieldsValue.address[1] : undefined,
        areaCode: (fieldsValue.address && fieldsValue.address.length > 2) ? fieldsValue.address[2] : undefined,
        communityCode: (fieldsValue.address && fieldsValue.address.length > 3) ? fieldsValue.address[3] : undefined,
        blockCode: (fieldsValue.address && fieldsValue.address.length > 4) ? fieldsValue.address[4] : undefined,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'meter/setFormValues',
        payload: values,
      });
      dispatch({
        type: 'meter/fetch',
        payload: values,
      });
    });
  };

  //重置查询选项为初始值
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'meter/setFormValues',
      payload: {},
    });
    dispatch({
      type: 'meter/fetch',
    });
  };

  //列表显示信息 事件，页数排序，过滤
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, meter: { formValues } } = this.props;

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
      type: 'meter/fetch',
      payload: params,
    });
  };

  //搜索框
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 32, xl: 48 }}>
          <Col md={8} sm={32}>
            <Form.Item label="水表编号">
              {getFieldDecorator('meterCode')(<Input placeholder="输入编号" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={32}>
            <Form.Item label="地址">
              {getFieldDecorator('address')(
                <FiveAddressCascader/>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={32}>
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
    const { meter: { selectedRows, data }, loading } = this.props;
    const columns = [
      {
        title: '水表账号',
        dataIndex: 'meterCode',
        key: 'meterCode',
      },
      {
        title: '所属用户',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '计费标准',
        dataIndex: 'waterPrice',
        key: 'waterPrice',
        render: text => <span>{text === undefined ? '未设置' : text}</span>,
      },
      {
        title: '状态',
        dataIndex: 'meterValve',
        key: 'meterValve',
        render: (text,record) => <span>{text === 'N'? "无阀门":ValveState[record.meterState]}</span>,
      },
      {
        title: '水表地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '所属营业厅',
        dataIndex: 'hallName',
        key: 'hallName',
      },
    ];

    return (
      <div>
        <Card bordered={false} className={styles.stepForm}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
            <br />
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={this.onValidateForm}>
                下一步
              </Button>
              <Button onClick={this.onPrev} style={{ marginLeft: 8 }}>
                上一步
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
