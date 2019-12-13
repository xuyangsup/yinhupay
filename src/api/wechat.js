import { get, post, postJson } from './request'

const wechantApi = {


    /**
     *
     * 分页查询banner
     * @param data
     * @param success
     */
    pageQueryBanner: function (data, success) {
     
        postJson('/api/v1/banner/queryPage', data, success);
    },
    /**
     *
     * 分页查询icon
     * @param data
     * @param success
     */
    pageQueryicon: function (data, success) {
     
        postJson('/api/v1/icon/queryPage', data, success);
    },
    /**
     *
     * 分页查询event
     * @param data
     * @param success
     */
    pageQueryevent: function (data, success) {
     
        postJson('/api/v1/event/queryPage', data, success);
    },


    /**
     *
     * 添加
     * @param data
     * @param success
     */
    insertbanner: function (data, success) {

        postJson('/api/v1/banner/add', data, success);
    },
    
    /**
     *queryPage( BannerQuery bannerQuery)
     * 添加
     * @param data
     * @param success
     */
    inserticon: function (data, success) {

        postJson('/api/v1/icon/add', data, success);
    },
    /**
     *queryPage( BannerQuery bannerQuery)
     * 添加
     * @param data
     * @param success
     */
    insertevent: function (data, success) {

        postJson('/api/v1/event/add', data, success);
    },


    /**
     *
     * 更新
     * @param data
     * @param success
     */
    updatebanner: function (data, success) {

        postJson('/api/v1/banner/update', data, success);
    },
    /**
    *
    * 更新
    * @param data
    * @param success
    */
   updateevent: function (data, success) {

       postJson('/api/v1/event/update', data, success);
   },
   /**
     *
     * 更新
     * @param data
     * @param success
     */
    updateicon: function (data, success) {

        postJson('/api/v1/icon/update', data, success);
    }

     
}


export default wechantApi;