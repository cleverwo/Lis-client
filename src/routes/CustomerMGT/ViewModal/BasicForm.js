import React from 'react';
import DescriptionList from '../../../components/DescriptionList/index';

const { Description } = DescriptionList;
const transform = {
  IDCARD: '身份证',
  PASSPORT: '驾驶证',
  OTHER: '其他',
  '': '其他',
};

const BasicForm = ({ record }) => {
  return (
    <div>
      <DescriptionList size="small" style={{ marginBottom: 22 }} col={1}>
        <Description term="用户名称">{record.name ? record.name : ''}</Description>
        <Description term="手机号">{record.phone ? record.phone : ''}</Description>
        <Description term="证件类型">
          {transform[record.certificateType ? record.certificateType : '']}
        </Description>
        <Description term="证件号码">{record.certificateNumber ? record.certificateNumber : ''}</Description>
      </DescriptionList>
    </div>
  );
};

export default BasicForm;
