import request from '@/utils/request'

const api_name = '/admin/acl/permission'

export default {
  // 获取所有权限
  getPermissionList(params) {
    return request({
      url: `${api_name}/list`,
      method: 'get',
      params
    })
  },
  // 删除权限
  deletePermissionById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'delete'
    })
  },
  // 添加权限
  savePermission(permission) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: permission
    })
  },
  // 修改权限
  updatePermission(permission) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: permission
    })
  },
  // 获取上级菜单
  getParentPermissionList() {
    return request({
      url: `${api_name}/parent/list`,
      method: 'get'
    })
  }
}
