import Vendor from './Vendor';
import VendorTrackRentRecord from '../VendorMgt/VendorTrackRentRecord';
import VendorFault from './VendorFault';
import VendorSeries from './VendorSeries';
import VendorManufacturer from './VendorManufacturer';

export default {
  ...Vendor,
  ...VendorFault,
  ...VendorSeries,
  ...VendorTrackRentRecord,
  ...VendorManufacturer,
};
