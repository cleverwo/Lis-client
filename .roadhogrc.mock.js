import mockjs from 'mockjs';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
//const noProxy = true;

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /*': 'http://127.0.0.1:8088',
  'POST /*': 'http://127.0.0.1:8088',
  'PATCH /*': 'http://127.0.0.1:8088',
  'DELETE /*': 'http://127.0.0.1:8088',
  'PUT /*': 'http://127.0.0.1:8088',
};

/*const proxy = {
  'GET /!*': 'http://127.0.0.1:8080',
  'POST /!*': 'http://127.0.0.1:8080',
  'PATCH /!*': 'http://127.0.0.1:8080',
  'DELETE /!*': 'http://127.0.0.1:8080',
  'PUT /!*': 'http://127.0.0.1:8080',
};*/

export default proxy;
