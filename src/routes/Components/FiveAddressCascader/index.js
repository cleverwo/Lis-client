import React, {Component} from 'react';
import {Cascader} from 'antd';
import {connect} from "dva";

function filter(inputValue, path) {
  return (path.some(option => (option.name).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
}
@connect(({community}) => ({
  community,
}))
class FiveAddressCascader extends Component {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'community/fetchCommunityList',
    });
  }

  onChange = (value, selectedOptions) => {
    // console.log("加载街道信息",value, selectedOptions);
    this.props.onChange(value);
  };

  render() {
    const {community: {communityList},value,disabled} = this.props;

    const initValue = value? value : [];
    const idEdit = disabled ? disabled : false;

    return (
      <div>
        <Cascader
          fieldNames={{label: 'name', value: 'code', children: 'children'}}
          options={communityList}
          onChange={this.onChange}
          placeholder="请选择..."
          defaultValue={initValue}
          showSearch={{ filter }}
          changeOnSelect
          style={{width: '100%'}}
          disabled={idEdit}
        />
      </div>
    );
  }
}

export default FiveAddressCascader
