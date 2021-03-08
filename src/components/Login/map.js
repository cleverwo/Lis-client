import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';
import { getMsg } from '../../locale/index';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: getMsg('login.please.input.username'),
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        max: 21,
        min: 5,
        message: getMsg('login.please.input.pwd'),
      },
    ],
  },
  PasswordAgain: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        max: 16,
        min: 6,
        message: getMsg('login.please.input.pwd.find'),
      },
    ],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: getMsg('login.mobile'),
    },
    rules: [
      {
        required: true,
        message: getMsg('login.please.input.mobile'),
      },
      {
        pattern: /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/,
        message: getMsg('login.please.input.mobile.wrong'),
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: getMsg('login.captcha'),
    },
    rules: [
      {
        required: true,
        message: getMsg('login.please.input.captcha'),
      },
    ],
  },
};

export default map;
