import {get, post, postJson} from './request'

const empApi = {
    
    /**
     *
     * 添加员工
     * @param emp
     * @param success
     */
    addEmp: function (emp, success) {
        postJson('/api/v1/emp/insert', emp, success);
    },


    /**
     *
     * 删除员工
     */
    deleteEmp: function (id, success) {
        const params = {
            id: id
        };
        postJson('/api/v1/emp/delete', params, success);
    },


    /**
     *
     * 更新员工
     */
    updateEmp: function (emp, success) {
        postJson('/api/v1/emp/update', emp, success);
    },


    /**
     *
     * 查询员工
     * @param id
     * @param success
     */
    queryEmp: function (id, success) {
        get('/api/v1/emp/' + id, success);
    },


    /**
     *
     * 分页查询
     * @param params
     * @param success
     */
    pageQuery: function (params, success) {
        postJson('/api/v1/emp/pageQuery', params, success);
    },


    /**
     *
     * 离职
     */
    leaveEmp: function (params, success) {
        postJson('/api/v1/emp/leave', params, success);
    },


    /**
     *
     * 给员工设置门店
     * @param empId
     * @param shopIds
     * @param success
     */
    setShops(empId, brandId, shopIds, success) {
        const params = {
            empId: empId,
            brandId: brandId,
            shopIds: shopIds
        }
        postJson('/api/v1/emp/setEmpShops', params, success)
    },


    /**
     *
     * 查询员工的门店权限
     */
    getEmpShops(empId, brandId, success) {
        const params = {
            empId: empId,
            brandId: brandId
        }
        get('/api/v1/emp/getEmpShops', params, success);
    },


    /**
     *
     * 查询员工的门店权限
     */
    getSetEmpShops(empId, brandId, success) {
        const params = {
            empId: empId,
            brandId: brandId
        }
        get('/api/v1/emp/getSetEmpShops', params, success);
    },


    setEmpRoles(empId, roleIds, success) {
        let params = {
            empId: empId,
            roleIds: roleIds
        }
        postJson('/api/v1/emp/setEmpRoles', params, success)
    },


    getSetEmpRoles(empId, success) {
        let params = {
            empId: empId
        }
        get('/api/v1/emp/getSetEmpRoles', params, success)
    }

};

export default empApi;
