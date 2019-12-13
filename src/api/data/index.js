import {get, post, postJson} from '@/api/request'

let dataApi = {

    queryMain(params, success) {
        postJson('/api/v1/data/queryMain', params, success)
    },

    queryPayTypeData(params, success) {
        postJson('/api/v1/data/queryPayTypeData', params, success)
    },

    querySourceData(params, success) {
        postJson('/api/v1/data/querySourceData', params, success)
    },

    queryDaySale(params, success) {
        postJson('/api/v1/data/queryDaySale', params, success)
    },

    exportMechSale(params, success) {

        postJson('/api/v1/data/export/mechSale', params, success)
    },
    // 营业额明细导出报表
    exportBusiness(params, success) {

        postJson('/api/v1/data/export/business', params, success)
    },
    // 员工考勤导出报表
    exportMechSign(params, success) {

        postJson('/api/v1/data/export/exportMechSign', params, success)
    },

    queryaddhuiyuan(params, success) {
        postJson('/api/v1/data/countNewUserBySelectCondition', params, success)
    }
}

export default dataApi
