// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// // 导入qs
// import qs from 'qs'
// // create an axios instance
// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 500000 // request timeout 超时时间
// })
// // request interceptor
// // 请求拦截器
// service.interceptors.request.use(
//   config => {
//     // console.log(config)
//     // do something before request is sent
//     // 判断store是否存在token
//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       // 读取token并设置到请求头中
//       config.headers['token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )
// // response interceptor
// // 响应拦截器
// service.interceptors.response.use(
// /**
// * If you want to get http information such as headers or status
// * Please return response => response
// */
//   /**
// * Determine the request status by custom code
// * Here is just an example
// * You can also judge the status by HTTP Status Code
// */
//   response => {
//     // 获取后端返回的数据
//     const res = response.data
//     // if the custom code is not 20000, it is judged as an error.
//     // 如果自定义代码不是200，则判断为错误。
//     if (res.code !== 200) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000 // 显示时间
//       })
//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//       // to re-login
//       // 重新登录
//         MessageBox.confirm('用户登录信息过期，请重新登录！', '系统提示', {
//           confirmButtonText: '登录',
//           cancelButtonText: '取消',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
// // 请求方法
// const http = {
//   // post请求提交
//   post(url, params) {
//     return service.post(url, params, {
//       transformRequest: [(params) => {
//         return JSON.stringify(params)
//       }],
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//   },
//   put(url, params) {
//     return service.put(url, params, {
//       transformRequest: [(params) => {
//         return JSON.stringify(params)
//       }],
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//   },
//   get(url, params) {
//     return service.get(url, {
//       params: params,
//       paramsSerializer: (params) => {
//         return qs.stringify(params)
//       }
//     })
//   },
//   getRestApi(url, params) {
//     let _params
//     if (Object.is(params, undefined || null)) {
//       _params = ''
//     } else {
//       _params = '/'
//       for (const key in params) {
//         // console.log(key)
//         // console.log(params[key])
//         if (Object.prototype.hasOwnProperty.call(params, key) && params[key] !== null && params[key] !== '') {
//           _params += `${params[key]}/`
//         }
//       }
//       _params = _params.substr(0, _params.length - 1)
//     }
//     console.log(_params)
//     if (_params) {
//       return service.get(`${url}${_params}`)
//     } else {
//       return service.get(url)
//     }
//   },
//   delete(url, params) {
//     let _params
//     if (Object.is(params, undefined || null)) {
//       _params = ''
//     } else {
//       _params = '/'
//       for (const key in params) {
//       // eslint-disable-next-line no-prototype-builtins
//         if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
//           _params += `${params[key]}/`
//         }
//       }
//       _params = _params.substr(0, _params.length - 1)
//     }
//     if (_params) {
//       return service.delete(`${url}${_params}`).catch(err => {
//         message.error(err.msg)
//         return Promise.reject(err)
//       })
//     } else {
//       return service.delete(url).catch(err => {
//         message.error(err.msg)
//         return Promise.reject(err)
//       })
//     }
//   },
//   upload(url, params) {
//     return service.post(url, params, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
//   },
//   login(url, params) {
//     return service.post(url, params, {
//       transformRequest: [(params) => {
//         return qs.stringify(params)
//       }],
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     })
//   }
// }
// export default http
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setExpireTime, clearStorage, setToken, removeExpireTime, getExpireTime } from '@/utils/auth'
import user from '@/api/user'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000 // request timeout
})
// 刷新token
function refreshTokenInfo() {
  const params = {
    token: getToken()
  }
  return user.refreshToken(params).then(res => res)
}
// 定义变量 是否刷新token
let isRefreshing = false
// request interceptor
service.interceptors.request.use(
  config => {
    // 获取当前时间
    const nowTime = new Date().getTime()
    // 获取过期时间
    const expireTime = getExpireTime()
    // 判断是否过期
    if (expireTime > 0) {
      const min = (expireTime - nowTime) / 1000 / 60
      // 如果过期时间小于5分钟，刷新token
      if (min < 10) {
        if (!isRefreshing) {
          // 修改刷新token状态
          isRefreshing = true
          // 刷新token
          return refreshTokenInfo().then(res => {
            // 判断是否刷新成功
            if (res.code === 200) {
              // 设置token
              setToken(res.data.token)
              setExpireTime(res.data.expireTime)
              // 将新的token设置到请求头中
              config.headers.token = getToken()
            }
            return config
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            // 修改刷新token状态
            isRefreshing = false
          })
        }
      }
    }

    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // 清空sessionStorage
    clearStorage()
    // 清空过期时间
    removeExpireTime()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 230 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('用户登录信息过期，请重新登录！', '系统提示', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // 清空sessionStorage
            clearStorage()
            // 清空过期时间
            removeExpireTime()
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 清空sessionStorage
    clearStorage()
    // 清空过期时间
    removeExpireTime()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

