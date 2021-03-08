import approval from './approval';
import approvalLog from './approvalLog';
import appApproval from './appApproval';
import withdrawApproval from './withdrawApproval';
import refundApproval from './refundApproval';
import vendorGoodApproval from './vendorGoodApproval';
import vendorTrackRentApproval from './vendorTrackRentApproval';

export default {
  ...approval,
  ...approvalLog,
  ...appApproval,
  ...withdrawApproval,
  ...refundApproval,
  ...vendorGoodApproval,
  ...vendorTrackRentApproval,
};
