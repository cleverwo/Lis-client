import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

function initColumn(columns) {
  const resultColumn = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }),
  );
  return resultColumn;
}

export class ResizeableTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const showColumns = initColumn(columns);
    this.state = {
      showColumns,
    };
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ showColumns }) => {
      const nextColumns = [...showColumns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { showColumns: nextColumns };
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  render() {
    const { data, rowKey, noSelect, scroll } = this.props;
    const {showColumns} = this.state;
    const paginationProps = {
      hideOnSinglePage: true,
    };

    return <Table bordered
                  bodyStyle={{ padding: 0 }}
                  pagination={paginationProps}
                  dataSource={data}
                  columns={showColumns}
                  components={this.components}/>;
  }
}
