import axios from './custom.interceptor';

async function getApiLogin(url) {
  return axios
    .get(url)
    .then(res => res.data)
    .catch(e => console.log('error get : ' + e));
}

async function postApiLogin(url, data) {
  return axios
    .post(url, data, {method: 'POST'})
    .then(res => res.data)
    .catch(e => console.log('ini error : ' + e));
}

async function putApiLogin(url, data) {
  return axios
    .put(url, data, {method: 'PUT'})
    .then(res => res.data)
    .catch(e => console.log('ini error : ' + e));
}

export {getApiLogin, postApiLogin, putApiLogin};
