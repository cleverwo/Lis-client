import Company from './Company';
import Region from './Region';
import AdminPerson from './AdminPerson';
export default {
  ...Company,
  ...Region,
  ...AdminPerson,
};
