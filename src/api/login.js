import {get, post, postJson} from './request'

/**
 *
 * 登录接口
 * @param loginName 用户名
 * @param password 密码
 * @param success 成功回调
 * @param fail 失败回调
 */
export function login(loginName, password,success) {

  const params = {
    loginName: loginName,
    password: password
  }

  post('/api/v1/login', params, success);
}


/**
 *
 * 退出
 * @param success
 * @param fail
 */
export function logout(success,fail) {
  post('/api/v1/logout', {}, success)
}


//重置密码
export function resetPassword(params, success) {
    postJson('/api/v1/resetPassword', params, success)
}
