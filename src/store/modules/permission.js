// 导入路由脚本文件
import { constantRoutes } from '@/router'
// 导入获取菜单的方法
import { getMenuList } from '@/api/user'
// 导入layout组件
import Layout from '@/layout'
// import { resolve } from 'core-js/fn/promise'

/**
 * Use meta.role to determine if the current user has permission
 * 判断当前用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * 过滤出符合用户角色的路由信息
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    // 判断当前用户是否有权限
    if (hasPermission(roles, tmp)) {
      // 判断是否有相应的根组件
      const component = tmp.component
      // 判断是否有组件
      if (route.component) {
        // 判断是否是layout组件
        if (component === 'Layout') {
          tmp.component = Layout
        } else {
          // 获取对应的组件
          tmp.component = (resolve) => require([`@/views${component}`], resolve)
        }
      }
      // 判断是否有子路由
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  // 设置路由信息
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 生成动态路由信息
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      // 发送请求获取菜单信息
      getMenuList().then(res => {
        // console.log(res)
        // 存放对应权限的路由信息
        let accessedRoutes
        // 判断状态码是否是200
        if (res.code === 200) {
          accessedRoutes = filterAsyncRoutes(res.data, roles)
        }
        // 保存路由信息到store中
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(err => {
        reject(err)
      })
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
