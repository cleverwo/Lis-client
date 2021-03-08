import RechargeRecord from './RechargeRecord';
import membership from './membership';
import membershipLevel from './membershipLevel';
import pointsRule from '../member/PointsRule';
export default {
  ...membership,
  ...RechargeRecord,
  ...membershipLevel,
  ...pointsRule,
};
