import { get, post, postJson } from './request'

const yingxiaoApi = {


    /**
     *
     * 分页查询营销 activity  分页查询活动 /api/v1/activity/pageQuery  
     * 根据Id查询 /api/v1/activity/pageQuery/queryById?id=1
     * @param data
     * @param success
     */
    pageQueryActivity: function (data, success) {
     
        postJson('/api/v1/activity/pageQuery', data, success);
    },
     

    /**
     *
     * 添加
     * @param data
     * @param success
     */
    insertActivity: function (data, success) {

        postJson('/api/v1/activity/addBaseInfo', data, success);
    },
     

    /**
     *
     * 更新  
     * @param data
     * @param success
     */
    updateActivity: function (data, success) {

        postJson('/api/v1/activity/update', data, success);
    },
    /**
     *
     * 更新
     * @param data
     * @param success
     */
    queryProduct: function (data, success) {
        //alert(data);
        get('/api/v1/activity/queryProductBySelect?param='+data, null, success);
    },
    
     /**
     *
     * 更新基本信息  
     * @param data
     * @param success
     */
    updateBaseActivity: function (data, success) {

        postJson('/api/v1/activity/updateBaseInfo', data, success);
    },
     /**
     *
     * 根据活动ID获取已有门店  
     * @param data
     * @param success
     */
    queryActivityShopByActivityId: function (data, success) {

        postJson('/api/v1/activity/queryActivityShopByActivityId', data, success);
    },
    /**
     *
     * 根据活动ID获取已有项目  
     * @param data
     * @param success
     */
    queryActivityProductByActivityId: function (data, success) {

        postJson('/api/v1/activity/queryActivityProductByActivityId', data, success);
    },
    /**
     *
     * 根据活动ID获取已有项目  
     * @param data
     * @param success
     */
    getActivityRuleByActivityId: function (data, success) {
        var activityId=data.activityId;
         
        get('/api/v1/activity/getActivityRuleByActivityId?activityId='+activityId, null, success);
    },
    /**
     *
     * 根据活动ID更新规则  
     * @param data
     * @param success
     */
    updateActivityRule: function (data, success) {
         
        postJson('/api/v1/activity/updateActivityRule', data, success);
         
       
    },
    /**
     *
     * 根据活动ID上传图片  
     * @param data
     * @param success
     */
    addActivityImage: function (data, success) {
         
        postJson('/api/v1/activity/addActivityImage', data, success);
         
       
    },
    /**
     *
     * 根据活动ID获取图片  
     * @param data
     * @param success
     */
    queryActivityImagesByActivityId: function (data, success) {
        var activityId=data.activityId;
        get('/api/v1/activity/queryActivityImagesByActivityId?activityId='+activityId, null, success);
         
       
    },
     /**
     *
     * 根据活动ID删除图片  
     * @param data
     * @param success
     */
    deleteActivityImage: function (data, success) {
         
        postJson('/api/v1/activity/deleteActivityImage', data, success);
         
       
    },
}


export default yingxiaoApi;