import { get, post, postJson } from './request'

const memberApi = {

  addMember: function (user, success) {

    postJson('/api/v1/user/insert', user, success);
  },

  pageQuery: function (params, success) {

    postJson('/api/v1/user/pageQuery', params, success);
  },

  queryOrderDetail(memberid, success) {

    postJson('/api/v1/user/loadUserInfoDetail?userId=' + memberid, null, success);
  },

  queryOrderInfoDetail(params, success) {
    var memberid = params.userId;
    var type = params.type;

    postJson('/api/v1/user/loadUserFinishedOrderDetail?userId=' + memberid + '&type=' + type, null, success);
  },

  chargeAmount(params, success) {
    postJson('/api/v1/user/chargeAmount', params, success);
  },

  queryChargePackage(success) {
    get('/api/v1/user/queryChargePackage', {}, success);
  }
}

export default memberApi;