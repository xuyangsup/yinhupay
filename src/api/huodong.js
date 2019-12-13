import { get, post, postJson } from './request'

const huodongApi = {


    /**
     *
     * 分页查询活动策略 Rule  分页查询活动 /api/v1/Rule/pageQuery  
     * 根据Id查询 /api/v1/Rule/pageQuery/queryById?id=1
     * @param data
     * @param success
     */
    pageQueryRule: function (data, success) {
     
        postJson('/api/v1/rule/pageQuery', data, success);
    },
     

    /**
     *
     * 添加
     * @param data
     * @param success
     */
    insertRule: function (data, success) {

        postJson('/api/v1/rule/insert', data, success);
    },
     

    /**
     *
     * 更新
     * @param data
     * @param success
     */
    updateRule: function (data, success) {

        postJson('/api/v1/rule/update', data, success);
    },
     
     
}


export default huodongApi;