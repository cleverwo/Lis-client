import common from './common/index';
import approval from './Approval/index';
import PersonCenter from './PersonCenter/index';
import Merchant from './Merchant/index';
import Marketing from './MarketingMgt/index';
import AdminMgt from './AdminMgt/index';
import VendorMgt from './VendorMgt/index';
import Goods from './Goods/index';
import Basic from './Basic/index';
import OrderMgt from './OrderMgt/index';
import OperationMgt from './OperationMgt/index';
import membership from './member/index';
import rechargeRecord from './member/RechargeRecord';
import AppMgt from './AppMgt/index';
import Vendor from './VendorMgt/Vendor';
import Replenisher from './Replenisher/index';
import Statistics from './Statistics/index';
import announcement from './announcement/index';

export default {
  ...common,
  ...approval,
  ...PersonCenter,
  ...Merchant,
  ...AdminMgt,
  ...Marketing,
  ...VendorMgt,
  ...OrderMgt,
  ...OperationMgt,
  ...Goods,
  ...membership,
  ...rechargeRecord,
  ...Basic,
  ...AppMgt,
  ...Vendor,
  ...Replenisher,
  ...Statistics,
  ...announcement,
};
