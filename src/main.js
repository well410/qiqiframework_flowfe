import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import {isContainEmpty, isNotContainEmpty, isNotEmpty, isEmpty} from "./utils";
import {globalConfig} from "./entity/config/index.js"
import VueCookies from 'vue-cookies'
import './styles/icon-question-style.css'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
Vue.component('vue-draggable-resizable', VueDraggableResizable);
import plTable from 'pl-table'
import 'pl-table/themes/index.css'
Vue.use(plTable);
import 'bootstrap'
import $ from 'jquery'
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
// 引入cookie
Vue.use(VueCookies);
import '@/icons' // icon
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import {DataTypeEnumsClass, messageEnums} from "./entity/enumns"; // global css


import './element-variables.scss'
import axios from 'axios'
import '@/styles/index.scss' // global css


import i18n from './lang' // Internationalization


import '@/permission' // permission control

import {getUserProdId} from "./api/prod-manager";

Vue.use(ElementUI, {
  // size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(vueCodemirror);
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  data() {
    return {
      eventHub: new Vue()
    }
  }
})


Vue.prototype.helper={
  helpUri:{name:'网址',uri:'http://helper.tcs.paas.cmbchina.cn'}
}

// 引入全局方法
// 临时变量替换（数字，字母，下划线）
Vue.prototype.tmpVarReplace = function tmpVarReplace(str) {
  return str.replace(/[\u4e00-\u9fa5]/g, "")
      .replace(/[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+=｛｝|《》？：“”【】、；‘’，。、\s]/g, "");
};
// 元规则结果替换（数字，括号，逻辑操作）
Vue.prototype.uResultReplace = function uResultReplace(str) {
  return str.replace(/[\u4e00-\u9fa5]/g, "")
      .replace(/[a-zA-Z]/g, "")
      .replace(/[`~@#$%^*\-+=<>?:"{},.\/;'\\[\]·~！@#￥%……*（）——\-+={}《》？｛｝：“”【】、；‘’，。、]/g, "");
};

// 全局方法
Vue.prototype.isEmpty = isEmpty;
Vue.prototype.isContainEmpty = isContainEmpty;
Vue.prototype.isNotContainEmpty = isNotContainEmpty;
Vue.prototype.isNotEmpty = isNotEmpty;

// 全局参数
Vue.prototype.gConfig = globalConfig;
Vue.prototype.$g6Editor = null;

// Vue 事件总线
Vue.prototype.$bus = new Vue();

// 权限点
Vue.prototype.res = {
  ruleCode: {name: "规则源码", code: "ruleCode"},
  ruleEdit: {name: "规则编辑", code: "ruleEdit"},
  ruleFlow: {name: "规则图", code: "ruleFlow"},
  ruleHis: {name: "规则历史", code: "ruleHis"},
  ruleVersion: {name: "规则版本", code: "ruleVersion"},
  ruleDelete: {name: "规则删除", code: "ruleDelete"},
  ruleManage: {name: "规则管理", code: "ruleManage"},
  ruleSearch: {name: "规则查询", code: "ruleSearch"},
  ruleAdd: {name: "规则新增", code: "ruleAdd"},
  ruleCitation: {name:'引用关系',code:'ruleCitation'},

  decsCode: {name: "决策源码", code: "decsCode"},
  decsEdit:{name:"决策编辑", code:"decsEdit"},
  decsFlow:{name:"决策图", code:"decsFlow"},
  decsHis:{name:"决策历史", code:"decsHis"},
  decsVersion:{name:"决策版本", code:"decsVersion"},
  decsDelete:{name:"决策删除", code:"decsDelete"},
  decsManage: {name: "决策管理", code: "decsManage"},
  decsAdd:{name:"决策新增", code:"decsAdd"},
  decsSearch: {name: "决策查询", code: "decsSearch"},
  decsCitation: {name:"引用关系",code:"decsCitation"}
};

Vue.prototype.helper={
  helpUri:{name:'网址',uri:'http://helper.tcs.paas.cmbchina.cn'},
  priHome:{name:'私有首页',uri:'/modules/function/1.html'},
  priAdd:{name:'私有新增',uri:'/modules/function/1.html#新增'},
  priVer:{name:'私有版本',uri:'/modules/function/1.html#版本'},
  priHis:{name:'私有历史',uri:'/modules/function/1.html#历史'},
  priTest:{name:'私有调试',uri:'/modules/function/1.html#调试'},
  // pubHome:{name:'共有首页',uri:'/modules/function/2.html'},
  // pubAdd:{name:'共有新增',uri:'/modules/function/2.html#新增'},
  // pubVer:{name:'共有版本',uri:'/modules/function/2.html#版本'},
  // pubHis:{name:'共有历史',uri:'/modules/function/2.html#历史'},
  // pubTest:{name:'共有调试',uri:'/modules/function/2.html#调试'},
}




