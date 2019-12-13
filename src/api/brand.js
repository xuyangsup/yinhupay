import {get, post, postJson} from './request'


const brandApi = {


    /**
     *
     * 分页查询
     * @param params
     * @param success
     */
    pageQuery: function (params, success) {

        postJson('/api/v1/brand/pageQuery', params, success);
    },


    /**
     *
     * 添加品牌
     * @param brand
     * @param success
     */
    insert: function (brand, success) {

        postJson('/api/v1/brand/insert', brand, success);
    },


    /**
     *
     * 更新
     * @param brand
     * @param success
     */
    update: function (brand, success) {

        postJson('/api/v1/brand/update', brand, success);
    },


    /**
     *
     * 查询管理的品牌
     */
    queryByEmp: function (success) {

        post('/api/v1/brand/queryByEmp', {}, success);
    }

}


export default brandApi;
