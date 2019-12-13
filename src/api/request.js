import axios from 'axios'
import show from '../common/show'
import {SUCCESS_CODE, NOT_LOGIN} from './constant'
var qs = require('qs')
import router from '../router'

function interceptor(res) {

  if (res.code == NOT_LOGIN) {
    console.log('未登录跳转到登录页面');
    router.replace('/login');
    return false;
  }
  return true;
}

/**
 *
 * get 获取数据
 * @param url
 * @param params
 * @param success
 * @param fail
 */
export function get(url, params, success) {

    axios.get(url, {
        params: params
    })
    .then(function (res) {
      console.log(res);
      if (interceptor(res.data)) {
        var result = res.data;
        if (result.code != SUCCESS_CODE) {
          show.error(result.message);
        } else {
          success(result.data);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
      show.error('网络异常');
    });

}


/**
 *
 * post params
 * @param url
 * @param params
 * @param success
 * @param fail
 */
export function post(url, params = {}, success) {
  axios.post(url, qs.stringify(params))
    .then(function (res) {
        console.log(res.data);
        if (interceptor(res.data)) {
          var result = res.data;
          console.log(result.code == 0);
          if (result.code == 0) {
            success(result.data);
          } else {
            show.error(result.message);
          }
        }
    }).catch(function (error) {
        console.log(error);
        show.error('网络异常');
    })
}


/**
 *
 * post 数据
 * @param url
 * @param json
 * @param success
 * @param fail
 */
export function postJson(url, json = {}, success) {
  axios.post(url, json)
    .then(function (res) {
      console.log(res.data);
      if (interceptor(res.data)) {
        var result = res.data;
        if (result.code != SUCCESS_CODE) {
          show.error(result.message);
        } else {
          success(result.data);
        }
      }
    }).catch(function (error) {
        console.log(error);
        show.error('网络异常');
    })
}


