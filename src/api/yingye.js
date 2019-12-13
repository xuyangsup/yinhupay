import { get, post, postJson } from './request'

const yingyeApi = {


    /**
     *
     * 分页查询banner
     * @param data
     * @param success
     */
    pageQueryyingye: function (data, success) {
     
        postJson('/api/v1/data/queryShopPerformanceSort', data, success);
    },
    /**
     *
     * 查询统计新增会员
     * @param data
     * @param success
     */
    pageQuerycountNewUser: function (data, success) {
     
        postJson('/api/v1/data/countNewUser', data, success);
    },
    /**
     *
     * 查询统计客数、客次
     * @param data
     * @param success
     */
    pageQueryOrderAndGuest: function (data, success) {
     
        postJson('/api/v1/data/countOrderAndGuest', data, success);
    },
    
     /**
     *
     * 查询统计充值总额
     * @param data
     * @param success
     */
    selectByQuery: function (data, success) {
     
        postJson('/api/v1/member/getRechardeCount', data, success);
    },

    /**
     * 
     * @param data 
     * @param success 
     */
    queryDayYeji: function (data, success) {
        postJson('/api/v1/data/export/queryDayYeji', data, success);
    }
     
}


export default yingyeApi;