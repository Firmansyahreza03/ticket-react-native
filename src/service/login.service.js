import {postApi} from '../api/api-non-login';

export const loginUser = data => {
  return postApi('http://192.168.10.105:3333/login', data);
};
