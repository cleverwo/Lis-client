//控制国际化语言，后期有需要的话可以加一个按钮切换语言
export function getLocale() {
  let locale = sessionStorage.getItem('vendplat30-locale');
  return locale ? locale : 'zh-CN';
}

export function setLocale(locale) {
  return sessionStorage.setItem('vendplat30-locale', locale);
}
