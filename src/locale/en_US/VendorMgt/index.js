import VendorTrackRentRecord from '../VendorMgt/VendorTrackRentRecord';
import VendorSeries from './VendorSeries';
import Vendor from './Vendor';
import VendorFault from './VendorFault';
export default {
  ...VendorFault,
  ...VendorSeries,
  ...VendorTrackRentRecord,
  ...Vendor,
};
