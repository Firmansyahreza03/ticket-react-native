import {getApiLogin} from '../api/api';

export const getProductByCust = () => {
  return getApiLogin('http://192.168.10.105:3333/customer-products/customers');
};
