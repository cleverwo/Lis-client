import VendorGoods from './VendorGoods';
import VendorReplenish from './VendorReplenish';
import StockOutStatistics from './StockOutStatistics';
import VendorDeploy from './VendorDeploy';
import ReplenishRecord from './ReplenishRecord';

export default {
  ...VendorGoods,
  ...VendorReplenish,
  ...StockOutStatistics,
  ...VendorDeploy,
  ...ReplenishRecord,
};
