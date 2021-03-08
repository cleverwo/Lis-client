import React, { Component } from 'react';
import { Avatar, List, Popover, Button, Modal } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';
import Ellipsis from '../Ellipsis';
import { Link } from 'react-router-dom';

export default class NoticeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalData: {},
    };
  }

  showModal(item) {
    const that = this;
    return () => {
      that.setState({
        modalVisible: true,
        modalData: item,
      });
    };
  }

  hideModal = id => {
    const { onNoticeClick } = this.props;
    const that = this;
    return () => {
      onNoticeClick(id);
      that.setState({
        modalVisible: false,
        modalData: {},
      });
    };
  };

  render() {
    const { data = [], onClick, onClear, title, locale, emptyText, emptyImage } = this.props;
    const { modalVisible, modalData } = this.state;

    if (data.length === 0) {
      return (
        <div className={styles.notFound}>
          {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
          <div>{emptyText || locale.emptyText}</div>
        </div>
      );
    }
    return (
      <div>
        <List className={styles.list}>
          {data.map((item, i) => {
            const itemCls = classNames(styles.item, {
              [styles.read]: item.read,
            });
            return (
              <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
                <List.Item.Meta
                  className={styles.meta}
                  avatar={
                    item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null
                  }
                  title={
                    <div className={styles.title}>
                      {item.title}
                      <div className={styles.extra}>{item.extra}</div>
                    </div>
                  }
                  description={
                    <div>
                      {/* <Ellipsis className={styles.description} length={10} tooltip>
                        {item.content}
                      </Ellipsis> */}
                      {/* <Popover placement="topLeft" title={item.title} content={<div  dangerouslySetInnerHTML={{ __html: item.content}}/>} trigger="click">
                        <Button>详情</Button>
                      </Popover> */}
                      <Button type="dashed" onClick={this.showModal(item)}>
                        详情
                      </Button>
                      <div className={styles.datetime}>{item.datetime}</div>
                    </div>
                  }
                />
              </List.Item>
            );
          })}
        </List>
        {/* <div className={styles.clear} onClick={onClear}>
          {locale.clear}
          {title}
        </div> */}
        <Modal
          title={modalData.title}
          visible={modalVisible}
          onOk={this.hideModal(modalData.id)}
          onCancel={this.hideModal(modalData.id)}
        >
          <div dangerouslySetInnerHTML={{ __html: modalData.content }} />
          {modalData.link ? (
            <Link to={modalData.link} onClick={this.hideModal(modalData.id)}>
              点击处理
            </Link>
          ) : (
            ''
          )}
        </Modal>
      </div>
    );
  }
}
