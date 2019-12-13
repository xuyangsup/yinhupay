import {get, post, postJson} from '../request'


const indexApi = {

    getIndexData: function getIndexData(success) {

        get('/api/v1/indexData', {}, success);
    },


    getIndexBrand: function (success) {

        get('/api/v1/indexBrand', {}, success);
    },


    getIndexUserInfo: function (success) {

        get('/api/v1/userInfo', {}, success)
    },

    getEmpShops(success) {

        get('/api/v1/getEmpShops', {}, success)
    }

}

export default indexApi
