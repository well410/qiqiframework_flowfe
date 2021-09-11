import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'
//import {tokenExpired, tokenInterceptor} from '@lt43/vue-cmb-auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    // config.headers['Authorization'] = 'Bearer eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJydGNfaWQiOiI4MDI3MzUyNyIsInN1YiI6IjgwMjczNTI3QGl0YyIsInlzdF9pZCI6IjI3MzUyNyIsIm9yaWdpbiI6Im9hIiwia2lkIjoicnNhMSIsImlzcyI6Imh0dHBzOlwvXC9vaWRjLmlkYy5jbWJjaGluYS5jblwvIiwibWZhIjoiZmFsc2UiLCJkZXAiOiLmgLvooYxcL-S_oeaBr-aKgOacr-mDqFwv5oub6ZO2572R57uc56eR5oqAXC_pm7bllK7lupTnlKjnoJTlj5HkuK3lv4NcL-e9kee7nOWuieWFqOW8gOWPkeWboumYn1wv6aOO5o6n5pyN5Yqh5byA5Y-R5LqM5a6k77yI5p2t5bee77yJIiwic2FwX2lkIjoiODAyNzM1MjciLCJhdWQiOiJMVDQzXzAxIiwidXNlcl90eXBlIjoiaXRjIiwib2ZmaWNlX3RlbCI6IjA1NzEtODE5MDYxMDQiLCJhdXRoX3RpbWUiOjE1ODUwNDc1MDAsIm5hbWUiOiLotKHmrKIiLCJwaG9uZV9udW1iZXIiOiIxNTI2MTg5ODA5OCIsImV4cCI6MTU4NTA3NjMwMCwiaWF0IjoxNTg1MDQ3NTAwLCJqdGkiOiI0MTFmYTVjYy1kYWVhLTQ2YjItYTRkZC1kN2JhODgxMjVhN2EiLCJlbWFpbCI6IiIsInVzZXJuYW1lIjoiODAyNzM1MjciLCJpdGNfaWQiOiI4MDI3MzUyNyJ9.fEEWRwYzSgdUS72J0n3klUVJz8txtqS8uekdTdPja8jBe9kKuOuEglKV9XD0SbQSNrd6jvEBaKLJeOatpuqvKWOkEW_9HTJEobE9vZ3QrVdyAifByj2dP0DuqZ5BqyQf5pwo9XpzEdaSkVn3KxKWNGsosycWFDSCy4k93XaPVWLFzLDr3f-wX88K34Q5QR_82g0sfvKEr3OUt8ZOzk9juS1SW9nHpID2rtPy8jMBTeFGz1EAUHeIceccGxZmUadC87t1fCrrTKIFqPK_C6_ZdW3_cCH8RbToDimWSp8uMLl6SMg8qW2VUZy17ObQDr3bXIEAxqZRvZBb2YklTszm2g' // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

//service.interceptors.request.use(tokenInterceptor())

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== '200') {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  //tokenExpired()
  /*error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }*/
)

export default service

