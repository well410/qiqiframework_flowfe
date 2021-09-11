import axios from 'axios'
import store from '@/store'
import ElementUI from 'element-ui';
//import {tokenExpired, tokenInterceptor} from '@lt43/vue-cmb-auth'

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = error => {
  // 设置字符串报文
  if (typeof error === 'string') {
    ElementUI.Message({dangerouslyUseHTMLString: true, message: error, type: 'error'});
    return;
  }

  // 请求报错情况下
  if (error.response && error.response.data && error.response.data.message) {
    ElementUI.Message({dangerouslyUseHTMLString: true, message: error.response.data.message, type: 'error'});
    return;
  }


  // 未知类型情况下
  ElementUI.Message({dangerouslyUseHTMLString: true, message: '发生未知错误，请联系管理员', type: 'error'});
};

/**
 * 审批提示
 * @param msg
 */
const tipAppr = msg => {
  ElementUI.Message({message: msg, type: 'success'});
};

const errorCodeSwitch = (data)=>{
  switch (data.code) {
    case '500':
      data.message = '接口异常'
      break
  }
};

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }

  getInsideConfig () {
    return {
      baseURL: this.baseUrl,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  }

  destroy (url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    //instance.interceptors.request.use(tokenInterceptor());

    // 响应拦截
    instance.interceptors.response.use(
        response => {
          // 可以加上自己的处理逻辑
          return response
        }
        //tokenExpired()
    );

    // 响应拦截
    instance.interceptors.response.use(res => {

      let noRejectCode = ["200", "E501"];
      this.destroy(url);
      const { data, status, headers} = res;
      // 审批流程拦截
      if (data.code === "appr_200"){
        tipAppr(data.message);
        return Promise.reject(data);
      }


      if (data == null || data.code == null || noRejectCode.indexOf(data.code) > -1) {
        return {data, status, headers};
      } else {
        tip(data.message);
        return Promise.reject(data);
      }
    }, error => {
      this.destroy(url);
      let errorInfo = error.response;
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error));
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      tip(error);
      //addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

export default HttpRequest
