import { get, post, postJson } from './request'

const noticeApi = {


    /**
     *
     * 分页查询公告
     * @param data
     * @param success
     */
    pageQuerynotice: function (data, success) {
     
        postJson('/api/v1/notice/queryPage', data, success);
    },
      


    /**
     *
     * 添加
     * @param data
     * @param success
     */
    insertnotice: function (data, success) {

        postJson('/api/v1/notice/add', data, success);
    },
     
    /**
     *
     * 更新
     * @param data
     * @param success
     */
    updatenotice: function (data, success) {
        if(data.status=='未发布'){
            data.status='N';
        }
        
        postJson('/api/v1/notice/update', data, success);
    },
    /**
     *
     * 删除 del
     * @param data
     * @param success
     */
    deletenotice: function (data, success) {
         
        
        postJson('/api/v1/notice/delete', data, success);
    },
    /**
     * 发布
     */
    publisherNotice: function (data, success) {
            
        postJson('/api/v1/notice/publisherNotice', data, success);
    },

     
}


export default noticeApi;