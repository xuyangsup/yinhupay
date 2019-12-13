import {get, post, postJson} from './request'

const cityApi = {

    /**
     *
     * 增加部门
     * @param dept
     * @param success
     */
    parentRegion: function (parentCode, success) {

        const params = {

            parentCode: parentCode
        }
        get('/api/v1/city/parent', params, success);
    },

}


export default cityApi;
