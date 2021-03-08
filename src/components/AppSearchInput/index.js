import { Component } from 'react';
import { Select } from 'antd';

import { connect } from 'dva/index';

const { Option } = Select;

@connect(({ appRecord, appinfo, appSearchInput, loading }) => ({
  appinfo,
  appSearchInput,
  appRecord,
  loading: loading.models.appRecord,
}))
/** 带搜索功能的Select下拉框，用来查询cm_user信息*/
class AppSearchInput extends Component {
  /**
   * 没有选中的情况下，输入框获取焦点，触发查询。
   * 主要是为了用户刚把鼠标放到输入框的时候，获取下数据。
   */
  onFocus = () => {
    const { appSearchInput: { current: { key, value } } } = this.props;
    if (!key) {
      this.onChange(value);
    }
  };

  onChange = (value, option) => {
    const {
      dispatch,
      appSearchInput: { timeout, current: { key } },
      initValue,
      clearInitValue,
    } = this.props;
    if (initValue != undefined && initValue != null && clearInitValue) {
      clearInitValue();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    //选中一个下拉记录时也会触发onChange,此时value是Option的value属性的值，不应该再次查询
    //所以为了判断，把option的key值加了_key后缀，如果key != value，说明是选中记录时触发的
    if (option && option.props.value != option.key) {
      return;
    } else {
      // 如果不是选中触发的onChange,将form field值清掉
      this.props.onSelectChange(undefined);
    }
    let tmpTimeout = setTimeout(() => {
      dispatch({
        type: 'appinfo/fetch',
        payload: { appName: value },
        callback: () => {
          dispatch({
            type: 'appSearchInput/current',
            payload: { value: value },
          });
        },
      });
    }, 300);
    dispatch({
      type: 'appSearchInput/timeout',
      payload: tmpTimeout,
    });
  };

  onSelect = (optionValue, option) => {
    this.props.onSelectChange(optionValue);
    this.props.dispatch({
      type: 'appSearchInput/current',
      payload: { key: optionValue, value: option.props.children },
    });
  };

  render() {
    const {
      appSearchInput: { current },
      appinfo: { data: { list } },
      initValue,
      disabled,
      style,
    } = this.props;
    let selectProps = {
      mode: 'combobox',
      placeholder: this.props.placeholder,
      style: this.props.style,
      defaultActiveFirstOption: false,
      showArrow: false,
      showSearch: false,
      filterOption: false,
      onChange: this.onChange,
      onSelect: this.onSelect,
      onFocus: this.onFocus,
      disabled: disabled,
      style: style,
    };
    if (current.key) {
      selectProps = { ...selectProps, value: current.value };
    }

    if (initValue != undefined && initValue != null) {
      selectProps = { ...selectProps, value: initValue };
    }
    //选中Option的时候，会先从Option的props中取value值，取不到才取key值，key加后缀不影响取值，只是为了在选中触发的onChange里面通过key!=value判断是选中触发的，不进行查询
    const options = list.map(record => (
      <Option key={record.id + '_key'} value={record.id.toString()}>
        {record.appName}
      </Option>
    ));
    return <Select {...selectProps}>{options}</Select>;
  }
}

export default AppSearchInput;
