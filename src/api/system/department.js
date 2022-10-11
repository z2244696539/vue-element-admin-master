import request from '@/utils/request'

const api_name = '/admin/acl/department'

export default {
  // 获取所有部门
  getDepartmentList(params) {
    return request({
      url: `${api_name}/list`,
      method: 'get',
      params
    })
  },
  // 删除部门
  deleteDepartmentById(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'delete'
    })
  },
  // 添加部门
  saveDepartment(department) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: department
    })
  },
  // 修改部门
  updateDepartment(department) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: department
    })
  },
  getParentTreeList() {
    return request({
      url: `${api_name}/getParentDepartment`,
      method: 'get'
    })
  }
}
