import {get, post, postJson} from '@/api/request'

const projectApi = {

    /**
     *
     * 分页查询
     * @param data
     * @param success
     */
    pageQuery: function (data, success) {
        
        postJson('/api/v1/productClassify/pageQuery', data, success);
    },


    /**
     *
     * 添加
     * @param data
     * @param success
     */
    insert: function (data, success) {

        postJson('/api/v1/productClassify/insert', data, success);
    },


    /**
     *
     * 更新
     * @param data
     * @param success
     */
    update: function (data, success) {

        postJson('/api/v1/role/update', data, success);
    },
    /**
     *
     * 更新
     * @param data
     * @param success
     */
    updatepro: function (data, success) {

        postJson('/api/v1/productClassify/update', data, success);
    },

    /**
     *
     * 开启分类
     */
    openStatus: function (id, success) {

        const params = {
            id: id
        }
        post('/api/v1/role/open', params, success)
    },
    /**
     *
     * 项目分类状态管理
     */
    openEnable: function (params, success) {
        
        postJson('/api/v1/productClassify/update', params, success)
    },
    
    /**
     *
     * 关闭分类
     */
    closeStatus: function (id, success) {

        const params = {
            id: id
        }
        post('/api/v1/role/close', params, success)
    },


    getRolePrivilege(roleId, success) {
        const params = {
            roleId: roleId
        }
        get('/api/v1/role/getSetRolePrivileges', params, success)
    },


    setRolePrivilege(roleId, privilegeIds, success) {
        const params = {
            roleId: roleId, privilegeIds: privilegeIds
        }
        postJson('/api/v1/role/setPrivileges', params, success)
    },


    /**
     *
     * 查询技师的提成
     * @param mechId
     * @param productId 门店项目Id
     * @param clockType
     * @param success
     */
    queryMechProductMoney(mechId, productId, clockType, success) {

        const params = {
            mechId: mechId,
            shopProductId: productId,
            clockType: clockType
        }
        postJson('/api/v1/shopProduct/queryMechProductMoney', params, success)
    }
}

export default projectApi;
