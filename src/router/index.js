import Vue from 'vue'
import Router from 'vue-router'
//import {beforeEachRouteEnter} from '@lt43/vue-cmb-auth'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import HttpComponentsManage from '../views/components/http-components-manage'
import KafkaComponentsManage from '../views/components/kafka-components-manage'
import ModelComponentsManage from '../views/components/model-components-manage'
import DecisionsManageNew from '../views/decisions/decisions-manage-new.vue'
import DecisionsManage from '../views/decisions/decisions-manage.vue'
import DecsGroupManage from '../views/decisions/decisions-group-manage.vue'
import RuleManage from '../views/decisions/rule-manage.vue'
import TemplateManage from '../views/decisions/template-manage.vue'
import ApprBasic from '../views/appr/appr-basic.vue'
import ApprInstance from '../views/appr/appr-instance.vue'
import ProdManage from '../views/appr/prod-manage.vue'
import DataManage from '../views/appr/data-manage.vue'
import ProUrlInfo from '../views/appr/pro-urlInfo.vue'
import Functions from '../views/functions/functions'
import PubFunction from '../views/functions/pub-function'
import VarManage from '../views/variables/variables-manage.vue'
import DataSourceManage from '../views/variables/data-source-manage.vue'
import LogSearch from '../views/variables/log-search.vue'
import TqsDatasourceManage from '../views/variables/tqs-datasource-manage.vue'
import DelayDisplay from '../views/monitor/decs-delay-display.vue'
import DecsStatusCodeDisplay from '../views/monitor/decs-status-code-display.vue'
import DecsNodeErrorCodeDisplay from '../views/monitor/decs-node-error-code-display.vue'
import DecsCntDisplay from '../views/monitor/decs-cnt-display.vue'
import DecsHome from '../views/home/DecsHome.vue'
import DecsInfo from '../views/decs/decs-info/DecsInfoHome2.vue'
import TemplateInfo from '../views/template/template-info/TemplateInfoHome2.vue'
import AdapterInfo from '../views/adapter/adapter-info/AdapterInfoHome2.vue'
import RuleHome from '../views/home/RuleHome.vue'
import TemplateHome from '../views/home/TemplateHome.vue'
import RuleInfo from '../views/rule/rule-info/RuleInfoHome2.vue'
import RequestMappingInf from '../views/decsgroup/RequestMappingInf.vue'
import {getProdId} from "../api/Prod";
import ElementUI from "element-ui";
import {rQueryEnums} from "../entity/enumns";
import AdapterHome from "../views/home/AdapterHome";
import DecsGroupHome from "../views/home/DecsGroupHome";
import DecsHomeNew from "../views/home/DecsHomeNew";
import HttpComponentsHome from '../views/home/HttpComponentsHome.vue'
import KafkaComponentsHome from '../views/home/KafkaComponentsHome.vue'
import ModelComponentsHome from '../views/home/ModelComponentsHome.vue'
import LogData from "../views/logdata/LogData";
import {errorTip} from "../utils/tools";
import PriFuncHome from '../views/home/PriFuncHome.vue'
import PubFuncHome from '../views/home/PubFuncHome.vue'
import PriFuncHistory from '../components/pri-function/FunctionHistory'
import PriFuncVersion from '../components/pri-function/FunctionVersion'
import PubFuncHistory from '../components/pub-function/FunctionHistory'
import PubFuncVersion from '../components/pub-function/FunctionVersion'
import PriFuncCitation from '../components/pri-function/FuncCitation'
import PubFuncCitation from '../components/pub-function/FuncCitation'
import ProdHome from "../views/home/ProdHome";

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
export const constantRouterMap = [
    {path: '/login', component: () => import('../views/login/index'), hidden: true},
    {path: '/404', component: () => import('../views/404'), hidden: true},

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () => import('../views/dashboardV2/index'),
            name: 'dashboard',
            meta: {title: '首页', icon: 'dashboard', noCache: false}
        }]
    },
    {
        path: '/variables',
        component: Layout,
        meta: {title: '变量管理', icon: 'drag', noCache: false},
        children: [
            {
                path: 'dataSourceManage',
                name: 'dataSourceManage',
                // component: () => import('@/views/variables/index'),
                meta: {title: '数据源配置', icon: 'drag_data', noCache: false},
                iframeComponent: DataSourceManage
            },
            {
                path: 'varManage',
                name: 'varManage',
                // component: () => import('@/views/variables/index'),
                meta: {title: '变量配置', icon: 'drag_var', noCache: false},
                iframeComponent: VarManage
            },
            {
                path: 'tqsDatasourceManage',
                name: 'tqsDatasourceManage',
                // component: () => import('@/views/variables/index'),
                meta: {title: '天擎数据源配置', icon: 'drag_data', noCache: false},
                iframeComponent: TqsDatasourceManage
            }
        ]
    },
    {
        path: '/decisions',
        component: Layout,
        meta: {title: '决策管理', icon: 'tree', noCache: false},
        children: [
            {
                path: 'decsGroupManage',
                name: 'decsGroupManage',
                // component: () => import('@/views/decisions/index'),
                meta: {title: '决策组配置', icon: 'tree_decs', noCache: false},
                iframeComponent: DecsGroupManage,
            },
            {
                path: 'decsManage',
                name: 'decsManage',
                // component: () => import('@/views/decisions/index'),
                meta: {title: '决策配置', icon: 'tree_decs', noCache: false},
                iframeComponent: DecisionsManage,
                //component: DecsHome,
                /*children: [
                    {
                        path: 'decsInf',
                        name: 'decsInf',
                        meta: {title: '决策详情'},
                        component: DecsInfo,
                    }
                ]*/
            },
            {
                path: 'decsManageNew',
                name: 'decsManageNew',
                // component: () => import('@/views/decisions/index'),
                meta: {title: '决策配置(新)', icon: 'tree_decs', noCache: false},
                iframeComponent: DecisionsManageNew,
            },
            {
                path: 'ruleManage',
                name: 'ruleManage',
                // component: () => import('@/views/decisions/index'),
                meta: {title: '规则配置', icon: 'tree_role', noCache: false},
                iframeComponent: RuleManage
            },
            {
                path: 'templateManage',
                name: 'templateManage',
                // component: () => import('@/views/decisions/index'),
                meta: {title: '模板配置', icon: 'tree_role', noCache: false},
                iframeComponent: TemplateManage
            },
            {
                path: 'functions',
                name: 'functions',
                // component: () => import('@/views/management/index'),
                meta: {title: '函数配置', icon: 'star', noCache: false},
                children: [
                    {
                        path: 'publicFunctions',
                        name: 'publicFunctions',
                        // component: () => import('@/views/functions/index'),
                        meta: {title: '公共函数配置', icon: 'star_pubfunc', noCache: false},
                        iframeComponent: PubFunction
                    },
                    {
                        path: 'privateFunctions',
                        name: 'privateFunctions',
                        meta: {title: '私有函数配置', icon: 'star_prifunc', noCache: false},
                        // component: () => import('@/views/management/index'),
                        iframeComponent: Functions
                    },
                ]
            },
            {
                path: 'components',
                name: 'components',
                // component: () => import('@/views/management/index'),
                meta: {title: '组件配置', icon: 'list', noCache: false},
                children: [
                    {
                        path: 'httpComponentsManage',
                        name: 'httpComponentsManage',
                        // component: () => import('@/views/components/index'),
                        meta: {title: 'http组件配置', icon: 'list_http', noCache: false},
                        iframeComponent: HttpComponentsManage
                    },
                    {
                        path: 'kafkaComponentsManage',
                        name: 'kafkaComponentsManage',
                        // component: () => import('@/views/components/index'),
                        meta: {title: 'kafka组件配置', icon: 'list_kafka', noCache: false},
                        iframeComponent: KafkaComponentsManage
                    },
                    {
                        path: 'modelComponentsManage',
                        name: 'modelComponentsManage',
                        // component: () => import('@/views/components/index'),
                        meta: {title: '模型组件配置', icon: 'list_kafka', noCache: false},
                        iframeComponent: ModelComponentsManage
                    }
                ]
            },
        ]
    },
    {
        path: '/apprManage',
        name: 'apprManage',
        component: Layout,
        meta: {title: '审批管理', icon: 'manage_approve', noCache: false},
        children: [
            {
                path: 'apprBasic',
                name: 'apprBasic',
                // component: () => import('@/views/management/index'),
                meta: {title: '审批流程配置', icon: 'approve_flow', noCache: false},
                iframeComponent: ApprBasic
            },
            {
                path: 'apprInstance',
                name: 'apprInstance',
                // component: () => import('@/views/management/index'),
                meta: {title: '审批实例配置', icon: 'approve_example', noCache: false},
                iframeComponent: ApprInstance
            },
            {
                path: 'proUrlInfo',
                name: 'proUrlInfo',
                // component: () => import('@/views/management/index'),
                meta: {title: '审批注册配置', icon: 'approve_register', noCache: false},
                iframeComponent: ProUrlInfo
            },
        ]
    },
    {
        path: '/sysManage',
        name: 'sysManage',
        component: Layout,
        meta: {title: '系统管理', icon: 'form', noCache: false},
        children: [
            {
                path: 'prodManage',
                name: 'prodManage',
                // component: () => import('@/views/management/index'),
                meta: {title: '产品权限配置', icon: 'manage_prod', noCache: false},
                iframeComponent: ProdManage
            },
            {
                path: 'dataManage',
                name: 'dataManage',
                // component: () => import('@/views/management/index'),
                meta: {title: '数据管理配置', icon: 'manage_data', noCache: false},
                iframeComponent: DataManage
            },
            {
                path: 'logSearch',
                name: 'logSearch',
                // component: () => import('@/views/management/index'),
                meta: {title: '日志查询', icon: 'manage_data', noCache: false},
                iframeComponent: LogSearch
            }
        ]
    },
    {
        path: '/monitorDisplay',
        name: 'monitorDisplay',
        component: Layout,
        meta: {title: '监控展示', icon: 'form', noCache: false},
        children: [
            {
                path: 'delayDisplay',
                name: 'delayDisplay',
                // component: () => import('@/views/management/index'),
                meta: {title: '时延监控', icon: 'manage_data', noCache: false},
                iframeComponent: DelayDisplay
            },
            {
                path: 'decsStatusCodeDisplay',
                name: 'decsStatusCodeDisplay',
                // component: () => import('@/views/management/index'),
                meta: {title: '决策状态码统计', icon: 'manage_data', noCache: false},
                iframeComponent: DecsStatusCodeDisplay
            },
            {
                path: 'decsNodeErrorCodeDisplay',
                name: 'decsNodeErrorCodeDisplay',
                // component: () => import('@/views/management/index'),
                meta: {title: '节点异常码统计', icon: 'manage_data', noCache: false},
                iframeComponent: DecsNodeErrorCodeDisplay
            },
            {
                path: 'decsCntDisplay',
                name: 'decsCntDisplay',
                // component: () => import('@/views/management/index'),
                meta: {title: '决策TPS统计', icon: 'manage_data', noCache: false},
                iframeComponent: DecsCntDisplay
            }
        ]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [
            {
                path: 'index',
                component: () => import('@/views/profile/profile'),
                name: 'Profile',
                meta: {title: '个人中心', icon: 'user', noCache: true}
            }
        ]
    },
    {
        path: '/ui/decsManageNew',
        name: '/decsManageNew',
        meta: {title: '决策首页'},
        component: DecsHomeNew,
        hidden: true,
        children: [
            {
                path: 'decsInf',
                name: 'decsInf',
                meta: {title: '决策详情'},
                component: DecsInfo,
            }
        ]
    },


    {
        path: '/ui/decsManage',
        name: '/decsManage',
        meta: {title: '决策首页'},
        component: DecsHome,
        hidden: true,
        children: [
            {
                path: 'decsInf',
                name: 'decsInf',
                meta: {title: '决策详情'},
                component: DecsInfo,
            }
        ]
    },
    {
        path: '/ui/decsManageNew',
        name: '/decsManageNew',
        meta: {title: '决策首页'},
        component: DecsHomeNew,
        hidden: true,
        children: [
            {
                path: 'decsInf',
                name: 'decsInf',
                meta: {title: '决策详情'},
                component: DecsInfo,
            }
        ]
    },
    {
        path: '/ui/ruleManage',
        name: '/ruleManage',
        meta: {title: '规则首页'},
        component: RuleHome,
        hidden: true,
        children: [
            {
                path: 'ruleInf',
                name: 'ruleInf',
                meta: {title: '规则详情'},
                component: RuleInfo,
            }
        ]
    },
    {
        path: '/ui/templateManage',
        name: '/templateManage',
        meta: {title: '模板首页'},
        component: TemplateHome,
        hidden: true,
        children: [
            {
                path: 'templateInf',
                name: 'templateInf',
                meta: {title: '模板详情'},
                component: TemplateInfo,
            }
        ]
    },
    {
        path: '/ui/adapterManage',
        name: '/adapterManage',
        meta: {title: '业务适配首页'},
        component: AdapterHome,
        hidden: true,
        children: [
            {
                path: 'adapterInf',
                name: 'adapterInf',
                meta: {title: '业务模块适配详情'},
                component: AdapterInfo,
            }
        ]
    },
    {
        path: '/ui/adapterManage/adapterInf',
        name: '/adapterManage',
        meta: {title: '业务模块适配详情'},
        component: AdapterInfo,
        hidden: true,
        children: [
            {
                path: 'ruleInf',
                name: 'ruleInf',
                meta: {title: '规则详情'},
                component: RuleInfo,
            }
        ]
    },
    {
        path: '/ui/decsGroupManage',
        name: '/decsGroupManage',
        meta: {title: '决策组首页'},
        component: DecsGroupHome,
        hidden: true,
        children: [
            {
                path: 'requestMappingInf',
                name: 'requestMappingInf',
                meta: {title: '请求映射详情'},
                component: RequestMappingInf,
            }
        ]
    },{
        path: '/model-components-manage',
        name: 'ModelComponentsManage',
        component: ModelComponentsHome,
        meta: {title: '模型组件首页'},
        hidden: true,
        children: [
            {
                path: 'model-interface-action',
                name: 'ModelInterfaceAction',
                meta: {title: '模型操作'},
                component: () => import('@/views/model-interface/model-interface-action.vue'),
            },
            {
                path: 'cmpt-version',
                name: 'CmptVersion',
                meta: {title: '组件版本'},
                component: () => import('@/views/cmpt-version/cmpt-version.vue'),
            },
            {
                path: 'cmpt-citation',
                name: 'CmptCitation',
                meta: {title: '组件引用'},
                component: () => import('@/views/cmpt-citation/cmpt-citation.vue'),
            },
            {
                path: 'cmpt-history',
                name: 'CmptHistory',
                meta: {title: '组件历史'},
                component: () => import('@/views/cmpt-history/cmpt-history.vue'),
            }
        ]
    },
    {
        path: '/http-components-manage',
        name: 'HttpComponentsManage',
        component: HttpComponentsHome,
        meta: {title: 'HTTP组件首页'},
        hidden: true,
        children: [
            {
                path: 'http-interface-action',
                name: 'HttpInterfaceAction',
                meta: {title: 'HTTP操作'},
                component: () => import('@/views/http-interface/http-interface-action.vue'),
            },
            {
                path: 'cmpt-version',
                name: 'CmptVersion',
                meta: {title: '组件版本'},
                component: () => import('@/views/cmpt-version/cmpt-version.vue'),
            },
            {
                path: 'cmpt-citation',
                name: 'CmptCitation',
                meta: {title: '组件引用'},
                component: () => import('@/views/cmpt-citation/cmpt-citation.vue'),
            },
            {
                path: 'cmpt-history',
                name: 'CmptHistory',
                meta: {title: '组件历史'},
                component: () => import('@/views/cmpt-history/cmpt-history.vue'),
            }
        ]
    },
    {
        path: '/kafka-components-manage',
        name: 'KafkaComponentsManage',
        component: KafkaComponentsHome,
        meta: {title: 'KAFKA组件首页'},
        hidden: true,
        children: [
            {
                path: 'kafka-interface-action',
                name: 'KafkaInterfaceAction',
                meta: {title: 'KAFKA操作'},
                component: () => import('@/views/kafka-interface/kafka-interface-action.vue'),
            },
            {
                path: 'cmpt-version',
                name: 'CmptVersion',
                meta: {title: '组件版本'},
                component: () => import('@/views/cmpt-version/cmpt-version.vue'),
            },
            {
                path: 'cmpt-citation',
                name: 'CmptCitation',
                meta: {title: '组件引用'},
                component: () => import('@/views/cmpt-citation/cmpt-citation.vue'),
            },
            {
                path: 'cmpt-history',
                name: 'CmptHistory',
                meta: {title: '组件历史'},
                component: () => import('@/views/cmpt-history/cmpt-history.vue'),
            }
        ]
    },
    {
        path: '/ui/logdata',
        name: 'LogData',
        meta: {title: '数据管理首页'},
        hidden: true,
        component: LogData,
    },
    {
        path: '/priFuncHome',
        name: 'priFuncHome',
        component: PriFuncHome,
        meta: {title: '私有函数首页'},
        hidden: true,
        children:[
            {
                path: 'priFuncHistory',
                name: 'PriFuncHistory',
                component: PriFuncHistory,
                meta: {title: '私有函数历史'},
            },
            {
                path: 'priFuncVersion',
                name: 'PriFuncVersion',
                component: PriFuncVersion,
                meta: {title: '私有函数版本'},
            },
            {
                path: 'priFuncCitation',
                name: 'priFuncCitation',
                component: PriFuncCitation,
                meta: {title: '私有函数引用关系'},
            }
        ]
    },
    {
        path: '/pubFuncHome',
        name: 'pubFuncHome',
        component: PubFuncHome,
        meta: {title: '公有函数首页'},
        hidden: true,
        children:[
            {
                path: 'pubFuncHistory',
                name: 'PubFuncHistory',
                component: PubFuncHistory,
                meta: {title: '公有函数历史'},
            },
            {
                path: 'pubFuncVersion',
                name: 'PubFuncVersion',
                component: PubFuncVersion,
                meta: {title: '公有函数版本'},
            },
            {
                path: 'pubFuncCitation',
                name: 'pubFuncCitation',
                component: PubFuncCitation,
                meta: {title: '公有函数引用关系'},
            }]
    },
    {
        path: '/ui/prod',
        name: 'Home',
        component: ProdHome,
        meta: {title: '首页'},
        hidden: true
    },
    {path: '*', redirect: '/404', hidden: true}
]

const router = new Router({
    mode: 'history', //后端支持可开
    base: process.env.BASE_URL,
    // scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
// 如果查询条件有产品id，则直接使用该产品id
    if (Object.keys(to.query).includes(rQueryEnums.PROD_ID.code)) {
        Vue.prototype.gConfig.prodId.value = to.query[rQueryEnums.PROD_ID.code].toLowerCase();
        next()
    }


    // 如果是去决策和规则管理首页，则通过后台获取产品id
    let uList = ['/ui/decsManage', '/ui/ruleManage', '/ui/adapterManage', '/ui/templateManage', '/ui/decsGroupManage', , '/ui/decsManageNew']
    if (uList.includes(to.path)) {
        getProdId().then(res => {
            let prodId = res.data.data;
            if (prodId === undefined || prodId === '' || prodId === null) {
                ElementUI.Message({message: "产品id获取失败", type: 'error'});
            } else {
                Vue.prototype.gConfig.prodId.value = res.data.data.toLowerCase();
                next();
            }
        }).catch(res => {
            ElementUI.Message({message: "产品id获取失败", type: 'error'});
        })
    } else {
        next();
    }
});

export default router

