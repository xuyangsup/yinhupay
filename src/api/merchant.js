import {get, post, postJson} from './request'

const merchantApi = {


    getByEmp: function (success) {

        post('/api/v1/merchant/getByEmp', {}, success)
    }
}


export default merchantApi;
