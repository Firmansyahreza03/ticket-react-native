import {getApiLogin, putApiLogin} from '../api/api';

export const getProfileCust = () => {
  return getApiLogin('http://192.168.10.105:3333/customers/users');
};

export const getProfileEmployee = () => {
  return getApiLogin('http://192.168.10.105:3333/employees/users');
};

export const getProfileCustById = id => {
  return getApiLogin(`http://192.168.10.105:3333/customers/${id}`);
};

export const getProfileEmpById = id => {
  return getApiLogin(`http://192.168.10.105:3333/employees/${id}`);
};

export const updateProfileCust = data => {
  return putApiLogin('http://192.168.10.105:3333/customers', data);
};

export const updateProfileEmp = data => {
  return putApiLogin('http://192.168.10.105:3333/employees', data);
};
