import {get, post, postJson} from './request'

const chuzhiApi = {
    pageQuery: function (params, success) {
        postJson('/api/v1/member/queryMemberAndMemberRechargeV2', params, success)
    },
    pageInfoQuery: function (params, success) {
        postJson('/api/v1/member/queryMemberRecharge', params, success)
    },
    queryPackages: function (params, success) {
        postJson('/api/v1/member/queryPackages', params, success)
    },
    addPackage: function (params, success) {
        postJson('/api/v1/member/addPackage', params, success)
    },
    updatePackage: function (params, success) {
        postJson('/api/v1/member/updatePackage', params, success)
    },
    deletePackage: function (params, success) {
        postJson('/api/v1/member/deletePackage', params, success)
    },
    exportMemberRecharge: function(params, success) {
        postJson('/api/v1/data/export/exportMemberRecharge', params, success)
    }
}

export default chuzhiApi
