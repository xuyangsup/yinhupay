import {get, post, postJson} from '@/api/request'

const shopProductApi = {


    /**
     *
     * 添加门店项目
     * @param data
     * @param success
     */
    insert: function (data, success) {

        postJson('/api/v1/shopProduct/insert', data, success)
    },

    /**
     *
     * 更新项目
     * @param data
     * @param success
     */
    update: function (data, success) {

        postJson('/api/v1/shopProduct/update', data, success)
    },


    /**
     *
     * 分页查询
     * @param params
     * @param success
     */
    pageQuery: function (params, success) {

        postJson('/api/v1/shopProduct/pageQuery', params, success)
    },


    query: function (params, success) {

        postJson('/api/v1/shopProduct/query', params, success)
    },

    addShopProduct(params, success) {

        postJson('/api/v1/shopProduct/addShopProduct', params, success)
    },


    /**
     *
     * 删除门店项目
     * @param params
     * @param success
     */
    deleteShopProduct(params, success) {

        postJson('/api/v1/shopProduct/delete', params, success)
    },


    /**
     *
     * 查询门店项目详情
     * @param id
     * @param success
     */
    queryShopProductDetail(id, success) {

        let params = {
            id: id
        }
        get('/api/v1/shopProduct/queryShopProductDetail', params, success)
    }


}

export default shopProductApi
