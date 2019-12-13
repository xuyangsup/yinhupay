import {get, post, postJson} from './request'


const shopApi = {


    queryById: function (id, success) {

        const params = {
            id: id
        }
        post('/api/v1/shop/queryById', params, success)
    },


    insert: function (shop, success) {

        postJson('/api/v1/shop/insert', shop, success)
    },



    update: function (shop, success) {

        postJson('/api/v1/shop/update', shop, success)
    },


    queryByBrand: function (brandId, success) {

        const params = {
            brandId: brandId
        }
        post('/api/v1/shop/queryByBrand', params, success)
    },


    queryHelpShop: function (params, success) {
        postJson('/api/v1/shop/queryShopHelp', params, success)
    },

    addShopHelp(params, success) {
        postJson('/api/v1/shop/addShopHelp', params, success)
    },

    addShopHelps(params, success) {
        postJson('/api/v1/shop/addShopHelps', params, success)
    },

    queryShopHelps(params, success) {
        postJson('/api/v1/shop/queryShopHelps', params, success)
    },


    queryHelpBrand(params, success) {
        post('/api/v1/shop/queryHelpBrand', params, success)
    }

}


export default shopApi
