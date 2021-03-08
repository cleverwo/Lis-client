import Advert from './Advert';
import Discount from './Discount';
import Organize from './Organize';
import VendorAdvert from './VendorAdvert';
import adConfig from './adConfig';
import advertiser from './Advertiser';

export default {
  ...Advert,
  ...Discount,
  ...Organize,
  ...VendorAdvert,
  ...adConfig,
  ...advertiser,
};
