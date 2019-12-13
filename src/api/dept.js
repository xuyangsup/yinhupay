import {get, post, postJson} from './request'

const dept = {


  /**
   *
   * 增加部门
   * @param dept
   * @param success
   */
  insert: function (dept, success) {

    postJson('/api/v1/dept/insert', dept, success);
  },


  /**
   * 更新部门
   * @param dept
   * @param success
   */
  update: function (dept, success) {

    postJson('/api/v1/dept/update', dept, success);
  },


  /**
   *
   * 删除部门
   * @param id
   * @param success
   */
  delete: function (id, success) {

    const params = {
      id: id
    };
    post('/api/v1/dept/delete', params, success);
  },


  /**
   *
   * 查询部门
   * @param id
   * @param success
   */
  query: function (id, success) {

    const params = {};

    get('/api/v1/dept/' + id, params, success);
  },


  /**
   *
   * 分页查询
   * @param data
   * @param success
   */
  pageQuery: function (data, success) {

    postJson('/api/v1/dept/pageQuery', data, success);
  },


  /**
   *
   * 查询商户下的部门
   * @param mchId
   * @param success
   */
  queryByEmp: function (success) {

    const params = {};
    post('/api/v1/dept/queryByEmp', params, success);
  }

}


export default dept;
