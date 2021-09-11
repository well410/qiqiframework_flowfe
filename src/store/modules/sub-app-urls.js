import { subAppUrls } from '@/api/sub-app-url'

const subAppUrl = {
  /* 存储各个子应用办公网和业务网的url */
  state: {
    eventSource: { 'oa': '', 'biz': '' },
    component: { 'oa': '', 'biz': '' },
    decisions: { 'oa': '', 'biz': '' },
    functions: { 'oa': '', 'biz': '' },
    variables: { 'oa': '', 'biz': '' },
    tqsDatasource: { 'oa': '', 'biz': '' },
    timeFront: { 'oa': '', 'biz': '' },
    fileFront: { 'oa': '', 'biz': '' },
    apprFront: { 'oa': '', 'biz': '' },
    prodFront: { 'oa': '', 'biz': '' },
    dataFront: { 'oa': '', 'biz': '' },
    logFront: { 'oa': '', 'biz': '' },
    monitorFront: { 'oa': '', 'biz': '' },
  },
  mutations: {
    setStateEventSourceOa: (state, url) => state.eventSource.oa = url,
    setStateEventSourceBiz: (state, url) => state.eventSource.biz = url,
    setStateComponentOa: (state, url) => state.component.oa = url,
    setStateComponentBiz: (state, url) => state.component.biz = url,
    setStateDecisionsOa: (state, url) => state.decisions.oa = url,
    setStateDecisionsBiz: (state, url) => state.decisions.biz = url,
    setStateFunctionsOa: (state, url) => state.functions.oa = url,
    setStateFunctionsBiz: (state, url) => state.functions.biz = url,
    setStateVariablesOa: (state, url) => state.variables.oa = url,
    setStateVariablesBiz: (state, url) => state.variables.biz = url,
    setStateTqsDatasourceOa: (state, url) => state.tqsDatasource.oa = url,
    setStateTqsDatasourceBiz: (state, url) => state.tqsDatasource.biz = url,
    setStateTimeFrontOa: (state, url) => state.timeFront.oa = url,
    setStateTimeFrontBiz: (state, url) => state.timeFront.biz = url,
    setFileFrontOa: (state, url) => state.fileFront.oa = url,
    setFileFrontBiz: (state, url) => state.fileFront.biz = url,
    setApprFrontOa: (state, url) => state.apprFront.oa = url,
    setApprFrontBiz: (state, url) => state.apprFront.biz = url,
    setProdFrontOa: (state, url) => state.prodFront.oa = url,
    setProdFrontBiz: (state, url) => state.prodFront.biz = url,
    setDataFrontOa: (state, url) => state.dataFront.oa = url,
    setDataFrontBiz: (state, url) => state.dataFront.biz = url,
    setLogFrontOa: (state, url) => state.logFront.oa = url,
    setLogFrontBiz: (state, url) => state.logFront.biz = url,
    setMonitorFrontOa: (state, url) => state.monitorFront.oa = url,
    setMonitorFrontBiz: (state, url) => state.monitorFront.biz = url,

  },
  actions: {
    getSubAppUrl({ commit }) {
      return new Promise((resolve, reject) => {
        subAppUrls().then(res => {
          const urlArr = res.data
          for (const i in urlArr) {
            if (urlArr[i].isOa.toUpperCase() === 'Y') {
              switch (urlArr[i].name.toLowerCase()) {
                case 'tcsevetfrontapp': {
                  commit('setStateEventSourceOa', urlArr[i].host)
                  break
                }
                case 'tcsvarsfrontapp': {
                  commit('setStateVariablesOa', urlArr[i].host)
                  break
                }
                case 'tqsdatasourcefrontapp': {
                  commit('setStateTqsDatasourceOa', urlArr[i].host)
                  break
                }
                case 'tcsdecsfrontapp': {
                  commit('setStateDecisionsOa', urlArr[i].host)
                  break
                }
                case 'tcsfuncfrontapp': {
                  commit('setStateFunctionsOa', urlArr[i].host)
                  break
                }
                case 'tcscmptfrontapp': {
                  commit('setStateComponentOa', urlArr[i].host)
                  break
                }
                case 'tcstimerfrontapp': {
                  commit('setStateTimeFrontOa', urlArr[i].host)
                  break
                }
                case 'tcsfilemanagerfrontapp': {
                  commit('setFileFrontOa', urlArr[i].host)
                  break
                }
                case 'tcsapprfrontapp': {
                  commit('setApprFrontOa', urlArr[i].host)
                  break
                }
                case 'tcsprodfrontapp': {
                  commit('setProdFrontOa', urlArr[i].host)
                  break
                }
                case 'tcsdatafrontapp': {
                  commit('setDataFrontOa', urlArr[i].host)
                  break
                }
                case 'tcslogfrontapp': {
                  commit('setLogFrontOa', urlArr[i].host)
                  break
                }
                case 'tcsmonitorfrontapp': {
                  commit('setMonitorFrontOa', urlArr[i].host)
                  break
                }
                default: {
                  console.log('未找到办公网子应用')
                }
              }
            } else {
              switch (urlArr[i].name.toLowerCase()) {
                case 'tcsevetfrontapp': {
                  commit('setStateEventSourceBiz', urlArr[i].host)
                  break
                }
                case 'tcsvarsfrontapp': {
                  commit('setStateVariablesBiz', urlArr[i].host)
                  break
                }
                case 'tqsdatasourcefrontapp': {
                  commit('setStateTqsDatasourceBiz', urlArr[i].host)
                  break
                }
                case 'tcsdecsfrontapp': {
                  commit('setStateDecisionsBiz', urlArr[i].host)
                  break
                }
                case 'tcsfuncfrontapp': {
                  commit('setStateFunctionsBiz', urlArr[i].host)
                  break
                }
                case 'tcscmptfrontapp': {
                  commit('setStateComponentBiz', urlArr[i].host)
                  break
                }
                case 'tcstimerfrontapp': {
                  commit('setStateTimeFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcsfilemanagerfrontapp': {
                  commit('setFileFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcsapprfrontapp': {
                  commit('setApprFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcsprodfrontapp': {
                  commit('setProdFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcsdatafrontapp': {
                  commit('setDataFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcslogfrontapp': {
                  commit('setLogFrontBiz', urlArr[i].host)
                  break
                }
                case 'tcsmonitorfrontapp': {
                  commit('setMonitorFrontBiz', urlArr[i].host)
                  break
                }
                default: {
                  console.log('未找到业务网子应用')
                }
              }
            }
          }
          resolve(res)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    }
  }
}

export default subAppUrl
