import {get, post, postJson} from '@/api/request'

const brandProdcutApi = {

    insert: function (data, success) {

        postJson('/api/v1/brandProduct/insert', data, success)
    },

    update: function (data, success) {

        postJson('/api/v1/brandProduct/update', data, success)
    },


    pageQuery: function (params, success) {

        postJson('/api/v1/brandProduct/pageQuery', params, success)
    },

    queryByBrand: function (brandId, success) {

        const params = {
            brandId: brandId
        }
        post('/api/v1/brandProduct/queryByBrand', params, success)
    }
}


export default brandProdcutApi;
