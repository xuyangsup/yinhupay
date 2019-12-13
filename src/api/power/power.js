import {get, post, postJson} from '@/api/request'

const powerApi = {

    insert(data, success) {
        postJson('/api/v1/privilege/insert', data, success)
    },


    pageQuery(params, success) {
        postJson('/api/v1/privilege/pageQuery', params, success)
    }
}

export default powerApi

