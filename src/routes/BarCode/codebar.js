import React from 'react';
import JsBarcode  from 'jsbarcode';

class BarCode extends React.Component {
//由父组件传入用来生成条形码的字符串“barCode”
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentDidMount() {
    this.toJsBarcode();
  }

  toJsBarcode(){
    const{ value} = this.props;
    // 调用 JsBarcode方法生成条形码
    JsBarcode(this.barcode, value, {
      text: value,
      format: "CODE39",
      displayValue: true,
      width: 2.0,
      height: 100,
      margin: 0,
    });
  }
  render() {
    return (
      <div className="barcode-box">
        <svg
          ref={(ref) => {
            this.barcode = ref;
          }}
        />
      </div>
    );
  }
}
export default BarCode;
