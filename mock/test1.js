import { parse } from 'url';
//test1
let testDataSource = [];
for (let i = 0; i < 66; i += 1) {
  testDataSource.push({
    id: i,
    name: `售货机 ${i}`,
    number: Math.floor(Math.random()) + 1,
    factory: `厂家 ${i}`,
    area: `区域 ${i}`,
    CTname: '王大锤',
    status: Math.floor(Math.random() * 10) % 3,
    replenishment: '小A',
  });
}

export function getMc(req, res, u) {
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

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
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

export function postMc(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, fields:{id,name,number}} = body;
  console.log('aaaaa')
  console.log(body)

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      testDataSource = testDataSource.filter(item => id.indexOf(item.id) === -1);
      break;
    case 'post':
      const i = testDataSource.length + 1;
      testDataSource.unshift({
        id: id,
        name: name,
        number: number,
        factory: `厂家${i}`,
        area: `区域${i}`,
        CTname: '王大锤',
        status: Math.floor(Math.random() * 10) % 3,
        replenishment: '小A',
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
  getMc,
  postMc,
};
