import { parse } from 'url';
//cotype.js
let testDataSource = [];
for (let i = 0; i < 46; i += 1) {
  testDataSource.push({
    key: i,//id=0~45
    ctId: i,
    ctName: `合作方式 ${i}`,
    ctSTime: new Date(`2018-05-${Math.floor(i / 2) + 1}`),//createdAt
    ctChTime: new Date(`2018-05-${Math.floor(i / 2) + 1}`),//更新时间
    ctIntro: '商家合作方式之合作描述',
  });
}

export function getCt(req, res, u) {
  console.log("进入mock/cotype.js getCt方法中：");
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...testDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  // if (params.status) {
  //   const status = params.status.split(',');
  //   let filterDataSource = [];
  //   status.forEach(s => {
  //     filterDataSource = filterDataSource.concat(
  //       [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
  //     );
  //   });
  //   dataSource = filterDataSource;
  // }

  // if (params.ctId) {
  //   dataSource = dataSource.filter(data => data.ctId.indexOf(params.ctId) > -1);
  // }

  if (params.ctIntro ){
    const ctIntro = params.ctIntro.split(',');
    let filterDataSource = [];
    ctIntro.forEach(s => {//array.filter(callback,[ thisObject]);
      filterDataSource = filterDataSource.concat(//ES5的合并数组
        [...dataSource].filter(data => data.ctIntro===s)
      );
    });
    dataSource = filterDataSource;
  }

  if (params.ctName){
    dataSource = dataSource.filter(data => data.ctName.indexOf(params.ctName) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function postCt(req, res, u, b) {
  console.log("进入mock/cotype.js postCt方法中：");
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  //const { method, fields:{ctId,ctIntro}} = body;
  const { method, ctId,ctName, ctIntro } = body;
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      testDataSource = testDataSource.filter(item => ctId.indexOf(item.ctId) === -1);
      break;
    case 'post':
      const i = testDataSource.length;
      testDataSource.unshift({
        key:i,
        ctId:i,
        ctName,
        ctSTime: new Date(),//createdAt
        ctChTime: new Date(),//更新时间
        ctIntro,
      });
      break;
    case 'patch':
      //const i = testDataSource.length;
      testDataSource.unshift({
        key:ctId,
        ctId,
        ctName,
        ctSTime: new Date(),//createdAt
        ctChTime: new Date(),//更新时间
        ctIntro,
      });
      break;
    default:
      break;
  }

  const result = {
    list: testDataSource,
    pagination: {
      total: testDataSource.length,
    },
  };
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getCt,
  postCt,
};
