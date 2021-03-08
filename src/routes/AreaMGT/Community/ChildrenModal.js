import React,{Component} from "react";
import {Button, Divider, Input, Modal, Popconfirm, Select, Table,message} from "antd";
import {connect} from "dva";

@connect(({community,user })=>({
  community,
  authorities: user.authorities,
}))
export default class ChildrenModal extends Component{
  index = 0;
  cacheOriginData = {};

  state={
    checkStatus: true,
  };

  //新增
  newMember = () => {
    const { dispatch ,community: { blockList }} = this.props;
    const newData = blockList.map((item,index) => ({ ...item }));
    this.index += 1;
    newData.push({
      id: `NEWID`, // 用于标识是新增的一行数据
      name: '',
      description: '',
      editable: true,
      isNew: true,
    });
    dispatch({
      type: 'community/applyNewData',
      payload: newData,
    });
    this.setState({
      checkStatus: false,
    });
  };

  handleFieldChange(e, fieldName, id) {
    const { dispatch ,community: { blockList }} = this.props;
    const newData = blockList.map((item,index) => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[fieldName] = e.target.value;
      dispatch({
        type: 'community/applyNewData',
        payload: newData,
      });
    }
  }

  handleKeyPress(e, id) {
    if (e.id === 'Enter') {
      this.saveRow(e, id);
    }
  }

  saveRow(e, id) {
    e.persist();
    const { community: { blockList,recordId } } = this.props;
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(id, blockList) || {};
    if (!target.name) {
      message.error("请填写描述信息");
      e.target.focus();
      return;
    }
    const { dispatch } = this.props;
    target['communityId'] = recordId['communityId']?recordId['communityId']:null;
    target['areaCode'] = recordId['areaCode']?recordId['areaCode']:null;
    delete target.id;
    dispatch({
      type: 'community/addBlock',
      payload: target,
      callback: success => {
        this.setState({
          checkStatus: true,
        });
        if (success) {
          this.toggleEditable(e, id);
        }
      },
    });
  }

  getRowByKey(id, newData) {
    return newData.filter(item => item.id === id)[0];
  }

  remove(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'community/removeBlock',
      payload: record,
    });
    this.setState({
      checkStatus: true,
    })
  }

  toggleEditable = (e, id) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { community: { blockList } } = this.props;
    const newData = blockList.map((item,index) => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[id] = { ...target };
      }
      target.editable = !target.editable;
      dispatch({
        type: 'community/applyNewData',
        payload: newData,
      });
    }
  };

  //关闭modal框
  afterCloseModal =()=>{
    const {dispatch} = this.props;
    //重置blockList
    dispatch({
      type: 'community/applyNewData',
      payload: [],
    });
    dispatch({
      type: 'community/setRecordId',
      payload: {},
    });
    //重置checkstatus
    this.setState({
      checkStatus: true,
    })
  };

  cancel(e, id) {
    this.clickedCancel = true;
    e.preventDefault();
    const { dispatch ,community: { blockList }} = this.props;
    const newData = blockList.map(item => ({ ...item }));
    const target = this.getRowByKey(id, newData);
    if (this.cacheOriginData[id]) {
      Object.assign(target, this.cacheOriginData[id]);
      target.editable = false;
      delete this.cacheOriginData[id];
    }
    dispatch({
      type: 'community/applyNewData',
      payload: newData,
    });
    this.clickedCancel = false;
  }

  updateRow(e, id) {
    e.persist();
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const { community: { blockList } ,dispatch} = this.props;
    const target = this.getRowByKey(id, blockList) || {};
    if (!target.name ) {
      message.error("楼栋别名不能为空");
      e.target.focus();
      return;
    }
    console.log("target",target)
    const param = { ...target };
    dispatch({
      type: 'community/updateBlock',
      payload: param,
      callback: success => {
        this.setState({
          checkStatus: true,
        });
        if (success) {
          this.toggleEditable(e, id);
        }
      },
    });
  }


  render() {
    const {modalVisible,handleModalVisible,isUpdate,community:{blockList},authorities} =this.props;
    const {checkStatus} = this.state;

    const isCreate = authorities.indexOf('am_area_create') > -1;
    const isDelete = authorities.indexOf('am_area_delete') > -1;
    const isEdit = authorities.indexOf('am_area_edit') > -1;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        id: 'name',
        width: '35%',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder='楼栋名称'
                maxLength={10}
              />
            );
          }
          return text;
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        id: 'description',
        width: '35%',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'description', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder='楼栋描述'
                maxLength={20}
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        id: 'action',
        width: '30%',
        align: 'center',
        render: (text, record) => {
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.id)}>
                    新增
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title='是否要删除此行?'
                    onConfirm={() => this.remove(record)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.updateRow(e, record.id)}>
                  保存
                </a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.id)}>
                  取消
                </a>
              </span>
            );
          }
          return (
            <span>
              {isEdit && isUpdate ? (
                <a onClick={e => this.toggleEditable(e, record.id)}>
                  编辑
                </a>
              ) : null}
              <Divider type="vertical" />
              <Popconfirm
                title='是否要删除此行?'
                onConfirm={() => this.remove(record)}
              >
                { isDelete && isUpdate ? (
                  <a>删除</a>
                ) : null}
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Modal
        title="楼栋管理"
        visible={modalVisible}
        onCancel={() => handleModalVisible(false)}
        width={1000}
        maskClosable={false}
        destroyOnClose={true}
        afterClose={this.afterCloseModal}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={blockList}
          pagination={false}
          rowKey={record => record.uid}
          scroll={{y: 240}}
        />
        {isCreate && isUpdate ? (
          checkStatus ? (
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.newMember}
              icon="plus"
            >
              新建
            </Button>
          ) : null
        ) : (
          ''
        )}

      </Modal>
    );
  }
}
