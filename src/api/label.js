import {get, post, postJson} from './request'

const labelApi = {
    /**
     * 分页查询
     */
    pageQuery: function (params, success) {

        postJson('/api/v1/label/queryLabel', params, success)
    },

    /**
     * 增加标签
     */
    addLabel: function (params, success) {
        
        postJson('/api/v1/label/addLabel', params, success)
    },

    /**
     * 修改标签
     */
    updateLabel: function (params, success) {

        postJson('/api/v1/label/updateLabel', params, success)
    },


    queryList(params, success) {
        postJson('/api/v1/label/queryList', params, success)
    }
}

export default labelApi
