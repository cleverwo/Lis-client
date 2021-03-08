import Notice from './Notice';
import PersonInformation from './PersonInformation';
import withdrawMoneyAudit from './withdrawMoneyAudit';
import PersonCenter from './PersonCenter';

export default {
  ...Notice,
  ...PersonInformation,
  ...withdrawMoneyAudit,
  ...PersonCenter,
};
