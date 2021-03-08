//ant design pro自带的国际化
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US';
//自定义的国际化
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import { addLocaleData } from 'react-intl';
import zh_CN from './zh_CN/index';
import en_US from './en_US/index';

import { getLocale } from './locale';

const antMsg = {
  'en-US': enUS,
  'zh-CN': zhCN,
};
export const antMessages = antMsg[getLocale()];
export function getAntMsg(key) {
  return antMessages[key];
}

addLocaleData(...zh, ...en);

export const msg = {
  'en-US': en_US,
  'zh-CN': zh_CN,
};

export const messages = msg[getLocale()];
export function getMsg(key) {
  return messages[key];
}
