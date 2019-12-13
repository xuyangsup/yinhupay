import {get, post, postJson} from '@/api/request'

const mechApi = {


    /**
     *
     * 添加技师
     * @param data
     * @param success
     */
    insert: function (data, success) {

        postJson('/api/v1/mech/insert', data, success)
    },


    /**
     *
     * 更新技师
     * @param data
     * @param success
     */
    update: function(data, success) {

        postJson('/api/v1/mech/update', data, success)
    },
/**
     *
     * 技师离职
     * @param data
     * @param success
     */
    leave: function(data, success) {

        postJson('/api/v1/mech/leave', data, success)
    },
    /**
     *
     * 技师签到
     * @param data
     * @param success
     */
    SignList: function(data, success) {

        postJson('/api/v1/mech/queryMechSignListByDto', data, success)
    },

    /**
     *
     * 分页查询技师
     * @param params
     * @param success
     */
    pageQuery: function (params, success) {

        postJson('/api/v1/mech/pageQuery', params, success)
    },


    /**
     *
     * 换门店
     * @param params
     * @param success
     */
    shiftShop: function (params, success) {

        postJson('/api/v1/mech/shiftShop', params, success)
    },



    queryMechSale(params, success) {

        postJson('/api/v1/mechSale/queryMechSale', params, success)
    },

    queryPage(params, success) {

        postJson('/api/v1/mech/queryPage', params, success)
    },

    queryMechYejiDetail(params, success) {
        postJson('/api/v1/data/export/mechSaleDetail', params, success)
    },

    queryMechProduct(params, success) {
        postJson('/api/v1/data/export/mechSaleProduct', params, success)
    },

    /**
     *
     * 查询技师等级
     * @param success
     */
    queryMechLevel(success) {
        get('/api/v1/mech/queryMechLevel', {}, success)
    }
}

export default mechApi
