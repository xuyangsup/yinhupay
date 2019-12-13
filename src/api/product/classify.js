import {get, post, postJson} from '@/api/request'

const classifyApi = {


    queryClassify: function (success) {

        get('/api/v1/productClassify/queryByMch', {}, success)
    }
}


export default classifyApi
