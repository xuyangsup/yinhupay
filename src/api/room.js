import {get, post, postJson} from './request'


const roomApi = {


    insert: function (data, success) {

        postJson('/api/v1/room/insert', data, success)
    },


    update: function (data, success) {

        postJson('/api/v1/room/update', data, success)
    },


    delete: function (id, success) {

        const params = {
            id: id
        }
        post('/api/v1/room/delete', params, success)
    },



    queryByShop: function (shopId, success) {

        const params = {
            shopId: shopId
        }
        post('/api/v1/room/queryByShop', params, success)
    }

}

export default roomApi
