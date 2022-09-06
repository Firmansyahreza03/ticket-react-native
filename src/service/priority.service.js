import {getApiLogin} from '../api/api';

export const getPriorities = () => {
  return getApiLogin('http://192.168.10.105:3333/priorities');
};
