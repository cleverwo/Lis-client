import React, {Component} from 'react';
import {Cascader} from 'antd';
import {connect} from "dva";

function filter(inputValue, path) {
  return (path.some(option => (option.name).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
}
function displayRender(name) {
  return name[name.length - 1];
}

@connect(({addressSystem}) => ({
  addressSystem,
}))
class AddressCascader extends Component {

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'addressSystem/fetchProvinceList'
    });
  }

  onChange = (value, selectedOptions) => {
    console.log("加载街道信息",value, selectedOptions);
    this.props.onChange(value);
  };

  render() {
    const {addressSystem: {provinces},value} = this.props;

    const initValue = value? value : [];

    return (
      <div>
        <Cascader
          fieldNames={{label: 'name', value: 'code', children: 'children'}}
          options={provinces}
          onChange={this.onChange}
          placeholder="请选择..."
          defaultValue={initValue}
          showSearch={{ filter }}
          changeOnSelect
        />
      </div>
    );
  }
}

export default AddressCascader
