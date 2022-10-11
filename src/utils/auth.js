import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
// 定义token过期时间的key
const TokenExpireKey = 'expireTime'
/**
 * 获取token
 * @returns
 */
export function getToken() {
  return Cookies.get(TokenKey)
}
/**
 * 设置token
 * @param {*} token
 * @returns
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
/**
 * 删除token
 * @returns
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
/**
 * 清除缓存
 * @returns
 */
export function clearStorage() {
  return sessionStorage.clear()
}
/**
 * 设置token过期时间
 */
export function setExpireTime(time) {
  return sessionStorage.setItem(TokenExpireKey, time)
}

/**
 * 获取token过期时间
  */
export function getExpireTime() {
  return sessionStorage.getItem(TokenExpireKey)
}

/**
 * 清空token过期时间
  */
export function removeExpireTime() {
  return sessionStorage.getItem(TokenExpireKey, 0)
}
