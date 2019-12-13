import {get, post, postJson} from './request'

const roleApi = {


  /**
   *
   * 分页查询
   * @param data
   * @param success
   */
  pageQuery: function (data, success) {

    postJson('/api/v1/role/pageQuery', data, success);
  },


  /**
   *
   * 添加
   * @param data
   * @param success
   */
  insert: function (data, success) {

    postJson('/api/v1/role/insert', data, success);
  },


  /**
   *
   * 更新
   * @param data
   * @param success
   */
  update: function (data, success) {

    postJson('/api/v1/role/update', data, success);
  },

  /**
   * 
   * 开启角色
   */
  openStatus: function (id, success) {

    const params = {
      id: id
    }
    post('/api/v1/role/open', params, success)
  },

  /**
   * 
   * 关闭角色
   */
  closeStatus: function (id, success) {

    const params = {
      id: id
    }
    post('/api/v1/role/close', params, success)
  },

  /**
   * 
   * 菜单权限查询
   */
  getRoleMenu(roleId, success) {
    
    const params = {
      roleId: roleId
    }
    get('/api/v1/role/getSetRoleMenus', params, success);
  },

  /**
   * 
   * 设置菜单权限
   */
  setRoleMenu(roleId, menuIdList, success) {

    const params = {
      roleId: roleId,
      menuIdList: menuIdList
    }
    postJson('/api/v1/role/setMenus', params, success)
  },


  getRolePrivilege(roleId, success) {
    const params = {
      roleId: roleId
    }
    get('/api/v1/role/getSetRolePrivileges', params, success)
  },


  setRolePrivilege(roleId, privilegeIds, success) {
    const params = {
      roleId: roleId,
      privilegeIds: privilegeIds
    }
    postJson('/api/v1/role/setPrivileges', params, success)
  }
}


export default roleApi;
