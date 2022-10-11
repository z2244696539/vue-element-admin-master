// import http from '@/utils/request'
// /**
//  * 用户登录
//  * @returns
//  */
// export async function login(data) {
//   return await http.login('/admin/acl/login', data)
// }
// /**
//  * 获取用户信息和权限信息
//  * @returns
//  */
// export async function getInfo() {
//   return await http.get('/admin/acl/user/userInfo')
// }
// /**
//  * 退出登录
//  * @returns
//  */
// export async function logout(param) {
//   // return await http.post('/api/sysUser/loginOut', param)
// }

import request from '@/utils/request'
import qs from 'qs'
const api = '/admin/acl/user'
/**
 * 用户登录方法
 * @param {*} data
 * @returns
 */
export function login(user) {
  return request({
    url: '/admin/acl/login',
    method: 'post',
    data: qs.stringify(user)
  })
}

export function getInfo() {
  return request({
    url: `${api}/getUserInfo`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: `${api}/logout`,
    method: 'post'
  })
}
/**
 * 获取菜单信息
 * @returns
 */
export function getMenuList() {
  return request({
    url: `${api}/getMenuList`,
    method: 'get'
  })
}
export default {
  getUserList(page, limit, params) {
    return request({
      url: `${api}/list/${page}/${limit}`,
      method: 'get',
      params
    })
  },
  saveUser(user) {
    return request({
      url: `${api}/save`,
      method: 'post',
      data: user
    })
  },
  updateUser(user) {
    return request({
      url: `${api}/update`,
      method: 'put',
      data: user
    })
  },
  deleteUser(id) {
    return request({
      url: `${api}/delete/${id}`,
      method: 'delete'
    })
  },
  /**
   * 根据用户id获取用户角色列表信息
   */
  getRoleListByUserId(id) {
    return request({
      url: `${api}/getRoleListByUserId/${id}`,
      method: 'get'
    })
  },
  /**
   *  获得分配角色列表数据
   */
  getRoleListForAssign(params) {
    return request({
      url: `${api}/getRoleListForAssign`,
      method: 'get',
      params
    })
  },
  saveAssignRole(params) {
    return request({
      url: `${api}/saveAssignRole`,
      method: 'post',
      data: params
    })
  },
  clearRole(userId) {
    return request({
      url: `${api}/clearRole/${userId}`,
      method: 'delete'
    })
  },
  refreshToken(params) {
    return request({
      url: `${api}/refreshToken`,
      method: 'post',
      data: params
    })
  }
}
