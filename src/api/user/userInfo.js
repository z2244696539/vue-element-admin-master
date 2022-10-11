import request from '@/utils/request'

const api_name = `/admin/user`
export default {
  // 用户列表
  findList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 用户锁定
  lock(id, status) {
    return request({
      url: `${api_name}/lock/${id}/${status}`,
      method: 'get'
    })
  },
  // 用户详情
  showDetailById(userId) {
    return request({
      url: `${api_name}/show/${userId}`,
      method: 'get'
    })
  },
  // 用户认证
  approval(userId, status) {
    return request({
      url: `${api_name}/approval/${userId}/${status}`,
      method: 'get'
    })
  }
}
