import axios from 'axios';

async function getApi(url) {
  return axios
    .get(url)
    .then(res => res.data)
    .catch(e => console.log('get error : ' + e));
}

async function postApi(url, data) {
  return axios
    .post(url, data, {method: 'POST'})
    .then(res => res.data)
    .catch(e => console.log('ini error login : ' + e));
}

export {getApi, postApi};
