import request from '@/utils/request'

const api_name = '/admin/acl/role'

export default {
  // 获取所有角色
  getRoleList(page, pageSize, params) {
    return request({
      url: `${api_name}/list/${page}/${pageSize}`,
      method: 'get',
      params
    })
  },
  // 删除角色
  deleteRoleById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'delete'
    })
  },
  // 添加角色
  saveRole(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  // 修改角色
  updateRole(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },
  // 查询角色的权限
  getAssignPermissionTree(userId, roleId) {
    return request({
      url: `${api_name}/getAssignPermissionTree/${userId}/${roleId}`,
      method: 'get'
    })
  },
  // 角色分配权限
  saveOrUpdateRoleAssign(params) {
    return request({
      url: `${api_name}/saveOrUpdateRoleAssign`,
      method: 'post',
      data: params
    })
  },
  getAssignPermissionIdList(roleId) {
    return request({
      url: `${api_name}/getAssignPermissionIdList/${roleId}`,
      method: 'get'
    })
  }
}

