import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, InputNumber, message, Popconfirm, Divider } from 'antd';
import styles from './style.less';

export default class StaircaseTableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.staircaseId === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };
  remove(key) {
    const newData = this.state.data.filter(item => item.staircaseId !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newStaircase = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    if (newData.length < 5) {
      let key = parseInt(new Date().valueOf() % 100000000);
      newData.push({
        staircaseId: key,
        startQuantity: 0,
        endQuantity: 0,
        staircasePrice: 0,
        editable: true,
        isNew: true,
      });
      this.index += 1;
      this.setState({ data: newData });
    } else {
      message.error('最多添加5个水价阶梯！');
    }
  };
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // target[fieldName] = e.target.value;
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (
        (!target.startQuantity && 0 !== target.startQuantity) ||
        !target.endQuantity ||
        !target.staircasePrice
      ) {
        message.error('请填写完整阶梯水价信息');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.endQuantity <= 0) {
        message.error('阶梯止量必须大于0');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if (target.staircasePrice <= 0) {
        message.error('阶梯价格必须大于0');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      // 判断输入数的是否比最后一个阶梯大
      // const staircase = this.state.data.map(item => ({ ...item }));
      // const lastStair = staircase[staircase.length - 2];
      // if (target.endQuantity <= lastStair.endQuantity || target.staircasePrice < lastStair.staircasePrice) {
      //   message.error('阶梯数据必须不小于上一个阶梯');
      //   e.target.focus();
      //   this.setState({
      //     loading: false,
      //   });
      //   return;
      // }

      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 500);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  render() {
    const { fee } = this.props;
    const columns = [
      // {
      //   title: '阶梯起价（m³)',
      //   dataIndex: 'startQuantity',
      //   key: 'startQuantity',
      //   width: '23%',
      //   render: (text, record) => {
      //     if (record.editable) {
      //       return (
      //         <Input
      //           value={text}
      //           autoFocus
      //           onChange={e => this.handleFieldChange(e, 'startQuantity', record.staircaseId)}
      //           onKeyPress={e => this.handleKeyPress(e, record.staircaseId)}
      //           placeholder="起价"
      //           type="number"
      //         />
      //       );
      //     }
      //     return text;
      //   },
      // },
      {
        title: '阶梯止量',
        dataIndex: 'endQuantity',
        key: 'endQuantity',
        width: '23%',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={e => this.handleFieldChange(e, 'endQuantity', record.staircaseId)}
                onKeyPress={e => this.handleKeyPress(e, record.staircaseId)}
                placeholder="止量"
                formatter={value => `${value}m³`}
                parser={value => value.replace('m³', '')}
                min={0}
                step={1}
                precision={0}
              />
            );
          } else {
            text = text + 'm³';
          }
          return text;
        },
      },
      {
        title: '阶梯基本价格',
        dataIndex: 'staircasePrice',
        key: 'staircasePrice',
        width: '25%',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            return (
              <InputNumber
                value={text}
                onChange={e => this.handleFieldChange(e, 'staircasePrice', record.staircaseId)}
                onKeyPress={e => this.handleKeyPress(e, record.staircaseId)}
                placeholder="价格"
                formatter={value => `${value}元`}
                parser={value => value.replace('元', '')}
                min={0}
                step={0.1}
                precision={2}
              />
            );
          } else {
            text = text + '元';
          }
          return text;
        },
      },
      {
        title: '阶梯合计',
        dataIndex: 'sum',
        key: 'sum',
        width: '20%',
        align: 'center',
        render: (text, record) => {
          return record.staircasePrice + fee + '元';
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => {
          if (!!record.editable && this.state.loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.staircaseId)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否要删除此行？"
                    onConfirm={() => this.remove(record.staircaseId)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.staircaseId)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.staircaseId)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.staircaseId)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="是否要删除此行？"
                onConfirm={() => this.remove(record.staircaseId)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
          rowKey="staircaseId"
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newStaircase}
          icon="plus"
        >
          新增水价阶梯
        </Button>
      </Fragment>
    );
  }
}
