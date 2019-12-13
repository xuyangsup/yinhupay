import {get, post, postJson} from '@/api/request'


const menuApi = {


    /**
     *
     * 获取菜单
     * @param success
     */
    fetchMenu: function (success) {

        get('/api/v1/emp/menu', {}, success)
    },


    /**
     *
     * 添加菜单
     * @param data
     * @param success
     */
    insert: function (data, success) {
        postJson('/api/v1/menu/insert', data, success)
    },


    getAll: function (success) {
        get('/api/v1/menu/getAll', {}, success)
    },

    getEmpMenus(success) {
        get('/api/v1/getEmpMenus', {}, success)
    }
}

export default menuApi
